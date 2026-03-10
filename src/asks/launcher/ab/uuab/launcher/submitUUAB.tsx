const launcherName = await os.showInput("", {
    title: "name this launcher, no spaces"
});

if (!launcherName) {
    console.log(`${tags.system}.${tagName}]: no launcher name`);
    return;
}

const abArtifactShard = {
    data: {
        uuabMenuData: thisBot.vars.uuabMenuData,
        uuabLocked: tags.uuabLocked
    },
    dependencies: [
        {
            askID: 'launcher'
        }
    ]
};
                
const launcherEgg = await ab.links.artifact.abCreateArtifactPromiseBot({
                    abArtifactName: 'launcher',
                    abArtifactInstanceID: uuid(),
                    abArtifactShard,
                });

console.log(`${tags.system}.${tagName}]: uuab promise bot`, launcherEgg);

//save UUAB to record
if (!authBot) {
    console.log(`${tags.system}.${tagName}]: no authbot`);
    await os.requestAuthBotInBackground();
}

if (!authBot) {
    console.log(`${tags.system}.${tagName}]: User not logged in.`);
    destroy(launcherEgg);
    return;
}

const studio = configBot.tags.studio ?? authBot.id;
configBot.tags.selected_studioID = studio;

const publishAttempt = await ab.links.store.abPublishAB({ab: launcherName, target: launcherEgg, sourceEvent: 'launcher_egg_publish', studio: studio, publicFacing: true});

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] saveData publishAttempt 1:`, publishAttempt);
}

if (!publishAttempt.success) {
    const permissions = await os.grantInstAdminPermission(studio);

    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] saveData permissions:`, permissions);
    }

    const secondPublishAttempt = await ab.links.store.abPublishAB({ab: launcherName, target: launcherEgg, sourceEvent: 'uuab_egg_publish', studio: studio, publicFacing: true});
        
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}]  saveData publishAttempt 2`, secondPublishAttempt);
    }

    if (!secondPublishAttempt.success){
        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] Could not publish`, secondPublishAttempt);
        }
        os.toast("could not publish");
        destroy(launcherEgg);
        return;
    } else {
        os.toast("Publishing successful");
        ab.links.manifestation.abSetAwake({ awake: true });
    }
} else {
    os.toast("Publishing successful");
}

//delete UUAB
destroy(launcherEgg);

//publish as ask
const confirm = await os.showConfirm({
    title: "confirm request",
    content: "request " + launcherName + " to be published?",
    confirmText: "request",
    cancelText: "cancel"
})
if (confirm) {
    //request ask
    ab.links.store.abPublishAskID({askID: launcherName, studioID: studio, patternID: launcherName});
}
links.uuabConfigurator.showUUABSetupMenu();