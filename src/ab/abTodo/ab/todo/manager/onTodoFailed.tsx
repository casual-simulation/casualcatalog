if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] todo failed:`, that?.todoId, 'plan:', that?.planId);
}

// Mark this plan as failed — remaining todos in this plan will be skipped
if (that?.planId) {
    tags.failedPlanId = that.planId;
}

tags.activeTodoId = null;

const agentBot = tags.activeAgentId ? getBot(byID(tags.activeAgentId)) : null;
if (agentBot) {
    agentBot.tags.task = null;
    setTagMask(agentBot, 'taskInProgress', false, 'tempLocal');
}

shout('onAnyTodoFailed', that);
