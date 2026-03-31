configBot.tags.menuPortal = 'home_place_update_menu';
let busyIndicator = await ab.links.menu.abCreateMenuBusyIndicator({ home_place_update_menu: true, label: `refreshing homeworld` });

//backup
const result = await thisBot.backupHomeworld();

if (result.success) {
    try {
        // await links.learn.updateAB({ reloadPage: false, showIndicator: false });

        // const artifactInstances = links.artifact.abGetArtifactInstances();
        
        // // Naively update all artifact shards in this inst before we begin reconstituting.
        // await links.artifact.abUpdateAllArtifactShards();

        // // Scrape the artifact instances for artifact bundles.
        // const toReconstitute = [];

        // for (const abArtifactInstanceID in artifactInstances) {
        //     const shardBots = artifactInstances[abArtifactInstanceID];
        //     const abArtifactBundle = shardBots[0].tags.abArtifactBundle;

        //     toReconstitute.push({
        //         abArtifactInstanceID,
        //         abArtifactBundle
        //     })

        //     // Bye bye old shard bots.
        //     destroy(shardBots);
        // }

        // // Reconsitute using the data we scraped from the previous artifact instances.
        // for (const entry of toReconstitute) {
        //     await links.artifact.abArtifactReconstitute({
        //         abArtifactInstanceID: entry.abArtifactInstanceID,
        //         abArtifactBundle: entry.abArtifactBundle,
        //         toast: false,
        //     })
        // }

        os.eraseInst(authBot.id, 'home');

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
        ab.links.utils.abLogAndToast({ message: `Refreshing home failed. ${ab.links.utils.getErrorMessage(e)}`, logType: 'error' });
    } finally {
        configBot.tags.menuPortal = null;
        destroy(busyIndicator);
    } 
} else {
    os.toast("Could not backup home, canceling refresh.");
}


