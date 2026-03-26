if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] todo finished:`, that?.todoId);
}

tags.activeTodoId = null;

// Reset agent's task state so it can pick up the next todo
const agentBot = tags.activeAgentId ? getBot(byID(tags.activeAgentId)) : null;
if (agentBot) {
    agentBot.tags.task = null;
    setTagMask(agentBot, 'taskInProgress', false, 'tempLocal');
}

shout('onAnyTodoFinished', that);
