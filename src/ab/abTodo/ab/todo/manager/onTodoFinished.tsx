if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] todo finished:`, that?.todoId);
}

setTagMask(thisBot, 'activeTodoId', null, 'shared');

// Reset agent's todo state so it can pick up the next todo
const agentBot = tags.activeAgentId ? getBot('id', tags.activeAgentId) : null;
if (agentBot) {
    agentBot.tags.todoBot = null;
    agentBot.tags.todoInProgress = false;
}

ab.links.utils.remoteShout({ name: 'onAnyTodoFinished', arg: that});