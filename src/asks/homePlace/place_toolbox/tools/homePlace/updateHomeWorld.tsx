if (!tags.homeBase) {
    return;
}

const confirm = await os.showConfirm({
    title: "Reconstitute Homeworld?",
    content: "Reconstituting this homeworld will remove any unsaved bots. Please make sure you have backed up this homeworld before proceeding.",
    confirmText: "proceed",
    cancelText: "cancel"
})

if (!confirm) {
   return;
}

configBot.tags.menuPortal = 'home_place_update_menu';
let busyIndicator = await ab.links.menu.abCreateMenuBusyIndicator({ home_place_update_menu: true, label: `reconstituting homeworld` });

try {
    await links.learn.updateAB({ reloadPage: false, showIndicator: false });
    
    // Naively update all artifact shards in this inst before we begin reconstituting.
    await links.artifact.abUpdateAllArtifactShards();

    const artifactInstances = links.artifact.abGetArtifactInstances();

    // Scrape the artifact instances for artifact bundles.
    const toReconstitute = [];

    for (const abArtifactInstanceID in artifactInstances) {
        const shardBots = artifactInstances[abArtifactInstanceID];
        const abArtifactBundle = shardBots[0].tags.abArtifactBundle;

        toReconstitute.push({
            abArtifactInstanceID,
            abArtifactBundle
        })

        // Bye bye old shard bots.
        destroy(shardBots);
    }

    // Reconsitute using the data we scraped from the previous artifact instances.
    for (const entry of toReconstitute) {
        await links.artifact.abArtifactReconstitute({
            abArtifactInstanceID: entry.abArtifactInstanceID,
            abArtifactBundle: entry.abArtifactBundle,
            toast: false,
        })
    }

    // Tell everyone to reload the page. This gets handled by abCore.
    const remoteDataEvent = 'update_ab_reload_page';
    const remoteDataArg = { reloadPage: true };

    if (os.isCollaborative()) {
        const remotes = await os.remotes();
        sendRemoteData(remotes, remoteDataEvent, remoteDataArg);
    } else {
        ab.onRemoteData({ name: remoteDataEvent, that: remoteDataArg, remoteId: configBot.id });
    }
} catch(e) {
    ab.links.utils.abLogAndToast({ message: `Reconstituting homeworld failed. ${ab.links.utils.getErrorMessage(e)}`, logType: 'error' });
} finally {
    configBot.tags.menuPortal = null;
    destroy(busyIndicator);
}
