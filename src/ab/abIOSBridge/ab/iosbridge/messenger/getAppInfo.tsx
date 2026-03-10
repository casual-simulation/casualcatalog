if (that.auxAppID) {
    if (tags.debug) os.log("Aux App ID has been set! " + that.auxAppID);
    thisBot.masks.auxAppID = that.auxAppID;
    configBot.tags.auxAppID = that.auxAppID;
} else {
    os.log("Error: Problem occurred trying to retrieve Aux App ID");
}


const webkit = window.webkit;
const message = {
    type: "app_info_retrieved",
}
webkit.messageHandlers.iosListener.postMessage(JSON.stringify(message));