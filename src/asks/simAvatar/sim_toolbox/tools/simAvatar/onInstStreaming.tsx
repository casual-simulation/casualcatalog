if (tags.remoteID) {
    if (configBot.tags.staticInst) {
        destroy(thisBot);
    } else {
        const remotes = await os.remotes();
        if (!remotes || !remotes.includes(tags.remoteID)) {
            destroy(thisBot);
        }
    }
}