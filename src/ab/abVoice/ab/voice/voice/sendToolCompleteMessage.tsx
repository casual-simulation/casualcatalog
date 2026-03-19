const complete_settings = {
    "type": "tool_response",
    "tool_call_id": that.id,
    "content": that.content ?? "completed"
};

if (thisBot.vars["toolResponseTimeout" + that.id]) {
    clearTimeout(thisBot.vars["toolResponseTimeout" + that.id]);
}

const humeSocket = thisBot.vars.humeSocket;

if(humeSocket) {
    humeSocket.send(JSON.stringify(complete_settings));
}