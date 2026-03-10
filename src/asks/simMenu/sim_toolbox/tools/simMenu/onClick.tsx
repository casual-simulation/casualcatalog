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