const tool_response = {
    "type": "tool_error",
    "tool_call_id": that.id,
    "tool_type": "function",
    "error": that.error,
    "content": that.content ?? undefined,
};

const humeSocket = thisBot.vars.humeSocket;

if (humeSocket) {
    humeSocket.send(JSON.stringify(tool_response));
}