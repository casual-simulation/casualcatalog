const tool_response = {
    "type": "tool_response",
    "tool_call_id": that.id,
    "content": that.content ?? "completed"
};

const humeSocket = thisBot.vars.humeSocket;

if (humeSocket) {
    humeSocket.send(JSON.stringify(tool_response));
}