if (tags.remoteID) {
    if (configBot.tags.staticInst) {
        thisBot.resetPlayer();
    } else {
        const remotes = await os.remotes();
        if (!remotes || !remotes.includes(tags.remoteID)) {
            thisBot.resetPlayer();
        }
    } 
}