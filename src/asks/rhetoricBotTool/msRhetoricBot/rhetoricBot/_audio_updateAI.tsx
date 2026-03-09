const humeSocket = thisBot.vars.humeSocket;
// console.log("Hume Websocket: ", humeSocket);

if (humeSocket) {
    let knowledgeBase = tags.knowledgeBase ?? [];

    const systemSettings = JSON.stringify(knowledgeBase);
    console.log("allowed_topics:", systemSettings);

    humeSocket.send(JSON.stringify({
        "type": "session_settings",
        "variables": {
            "allowed_topics": systemSettings,
        }
    }));
}