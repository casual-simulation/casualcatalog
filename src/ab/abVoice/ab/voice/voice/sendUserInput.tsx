const humeSocket = thisBot.vars.humeSocket;

if (humeSocket) {
    await thisBot.sendSessionSettings();
    
    humeSocket.send(JSON.stringify({
        "type": "user_input",
        "text": that.message,
    }));
}