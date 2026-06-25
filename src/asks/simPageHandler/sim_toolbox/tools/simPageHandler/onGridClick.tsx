shout("clearSimPlayerMenu");

if (that) {
    if (that.modality == 'mouse' && that.buttonId == 'right') { 
        return;
    }
}

await thisBot.clearPropActions();

if (!tags.simStarted) {
    if (configBot.tags.staticInst) {
        shout("onRemoteData", {
            name: "onStartMenu",
            that: null,
            remoteId: getID(configBot)
        });
    } else {
        const remotes = await os.remotes();
        await sendRemoteData(remotes, "onStartMenu");
    }
}

if (!tags.pageInitialized) {
    tags.pageInitialized = true;
    thisBot.setupPage();
}