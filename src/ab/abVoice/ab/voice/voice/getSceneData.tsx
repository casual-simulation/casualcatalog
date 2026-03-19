const bots = getBots(byTag(ab.links.remember.tags.abActiveDimension, true), not(byTag("abIgnore", true)), not(byTag("abBot", true)));

const tool_response = {
    "type": "tool_response",
    "tool_call_id": that.id,
    "content": JSON.stringify(bots)
};

console.log("Scene Data Sent: ", bots)
if (tags.debugMode == true) {
    ab.log({
        message: "Scene Data Sent: " + JSON.stringify(bots),
        name: 'casualos',
        space: "shared",
        messageOrigin: configBot.id,
    });
}

const humeSocket = thisBot.vars.humeSocket;

if(humeSocket) {
    humeSocket.send(JSON.stringify(tool_response));
}