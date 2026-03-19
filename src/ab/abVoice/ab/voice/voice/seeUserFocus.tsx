const focus = ab.links.remember.links.abMultipleBotFocus ?? ab.links.remember.links.abBotFocus ?? ab.links.remember.links.abGridFocus ?? ab.links.remember.tags.abGridFocus ?? null

const tool_response = {
    "type": "tool_response",
    "tool_call_id": that.id,
    "content": JSON.stringify(focus)
};

const humeSocket = thisBot.vars.humeSocket;

console.log("User Focus Data Sent: ", focus)
if (tags.debugMode == true) {
    ab.log({
        message: "User Focus Data Sent: " + JSON.stringify(focus),
        name: 'casualos',
        space: "shared",
        messageOrigin: configBot.id,
    });
}

if(humeSocket) {
    humeSocket.send(JSON.stringify(tool_response));
}