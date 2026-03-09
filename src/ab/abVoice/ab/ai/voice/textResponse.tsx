// let response = await ai.chat(responsePrompt, {
//     preferredModel: tags.aiModel
// });

const humeSocket = thisBot.vars.humeSocket;

if(humeSocket) {
    humeSocket.send(JSON.stringify({
        "type": "user_input",
        "text": that.message,
    }));
}