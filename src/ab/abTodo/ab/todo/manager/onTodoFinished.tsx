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

// When a build plan finishes, spawn the approval bot and broadcast the completed event. Lives
// on the manager (which runs on one client) so the shared approval bot isn't created N times.
const finishedTodo = that?.todoId ? getBot('id', that.todoId) : null;
const planId = finishedTodo?.tags.todoPlanId;

const isBuildPlanCandidate =
    finishedTodo &&
    planId &&
    !finishedTodo.tags.isUserAskTodo &&
    !finishedTodo.tags.isUserApprovalTodo &&
    finishedTodo.tags.agentMode === 'build';

let buildPlanCompleted = false;
if (isBuildPlanCandidate) {
    const planTodos = getBots(b => b.tags.abPatchTodoInstance && b.tags.todoPlanId === planId)
        .sort((a, b) => (a.tags.todoOrder ?? 0) - (b.tags.todoOrder ?? 0));

    const planFinished = planTodos.length > 0
        && planTodos.every(b => b.tags.abTodoComplete)
        && !planTodos.some(b => b.tags.abPatchError);
    const isLastTodo = planTodos.at(-1)?.id === finishedTodo.id;
    const approvalExists = !!getBot(b => b.tags.isUserApprovalTodo && b.tags.todoApprovalForPlanId === planId);

    buildPlanCompleted = planFinished && isLastTodo && !approvalExists;
}

// Tell listeners whether this completion also ends a build plan, so the per-todo chime can
// step aside for the plan-completed chime on the very last todo.
ab.links.utils.remoteShout({ name: 'onAnyTodoFinished', arg: { ...that, buildPlanCompleted } });

if (buildPlanCompleted) {
    ab.links.utils.remoteShout({ name: 'onAnyABBuildPlanCompleted', arg: { todoId: finishedTodo.id, planId } });
    whisper(finishedTodo, 'spawnUserApprovalTodo');
}
