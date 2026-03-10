let sound = that;
const collaborative = await os.isCollaborative();

if (collaborative) {
    let remotes = await os.remotes();
    sendRemoteData(remotes, "playSound", {
        message: that
    });
}
else {
    shout("onRemoteData", { "name": "playSound", "that": { "message": that } });
}