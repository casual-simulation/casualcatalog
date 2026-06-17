if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] todo failed:`, that?.todoId, 'plan:', that?.planId);
}

// Mark this plan as failed — remaining todos in this plan will be skipped
if (that?.planId) {
    setTagMask(thisBot, 'failedPlanId', that.planId, 'local');
}

setTagMask(thisBot, 'activeTodoId', null, 'local');

const agentBot = tags.activeAgentId ? getBot('id', tags.activeAgentId) : null;
if (agentBot) {
    agentBot.tags.todoBot = null;
    agentBot.tags.todoInProgress = false;
}

ab.links.utils.remoteShout({ name: 'onAnyTodoFailed', arg: that});