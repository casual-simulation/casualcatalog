console.log("doSharedAction: ", that);

const {
    actionType,
    actionData
} = that;

const collaborative = await os.isCollaborative();

if (collaborative){
    const remotes = await os.remotes();
    sendRemoteData(remotes, actionType, {
        message: actionData
    });
}
else {
    shout("onRemoteData", { "name": actionType, "that": { "message": actionData } });
}