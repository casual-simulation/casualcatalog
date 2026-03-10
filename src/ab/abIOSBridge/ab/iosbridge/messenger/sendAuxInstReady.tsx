const webkit = window.webkit;
const message = {
    type: "aux_inst_ready",
    inst: configBot.tags.inst
}
if (tags.debug) {
    os.log("Window: " + window);
    os.log("Webkit: " + window.webkit);
    os.log("MessageHandlers: " + window.webkit.messageHandlers);
    os.log("iosListener: " + webkit.messageHandlers.iosListener);
}
webkit.messageHandlers.iosListener.postMessage(JSON.stringify(message));