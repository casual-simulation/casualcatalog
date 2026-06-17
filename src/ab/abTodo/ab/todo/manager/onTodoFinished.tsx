if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] todo finished:`, that?.todoId);
}

setTagMask(thisBot, 'activeTodoId', null, 'local');

// Reset agent's todo state so it can pick up the next todo
const agentBot = tags.activeAgentId ? getBot('id', tags.activeAgentId) : null;
if (agentBot) {
    agentBot.tags.todoBot = null;
    agentBot.tags.todoInProgress = false;
}

// When a build plan finishes, spawn the approval bot and broadcast the completed event.
const finishedTodo = that?.todoId ? getBot('id', that.todoId) : null;
const planId = finishedTodo?.tags.todoPlanId;

const isApprovalCandidate =
    finishedTodo &&
    planId &&
    !finishedTodo.tags.isUserAskTodo &&
    !finishedTodo.tags.isUserApprovalTodo;

const isBuildPlanCandidate = isApprovalCandidate && finishedTodo.tags.agentMode === 'build';

// Plan-mode user request todos that complete without ever spawning child todos (e.g. a
// simple chat-only response that ends in `completeTodo`) need their own approval so the
// user can move them to the log dimension. If the agent created build descendants, those
// will spawn the approval themselves when their plan finishes.
const isPlanModeUserRequestCandidate =
    isApprovalCandidate &&
    finishedTodo.tags.agentMode === 'plan' &&
    !getBot(b => b.tags.abPatchTodoInstance && b.tags.todoParentId === finishedTodo.id);

let buildPlanCompleted = false;
let userRequestPlanCompleted = false;
if (isBuildPlanCandidate || isPlanModeUserRequestCandidate) {
    const planTodos = getBots(b => b.tags.abPatchTodoInstance && b.tags.todoPlanId === planId)
        .sort((a, b) => (a.tags.todoOrder ?? 0) - (b.tags.todoOrder ?? 0));

    const planFinished = planTodos.length > 0
        && planTodos.every(b => b.tags.abTodoComplete)
        && !planTodos.some(b => b.tags.abPatchError);
    const isLastTodo = planTodos.at(-1)?.id === finishedTodo.id;
    const approvalExists = !!getBot(b => b.tags.isUserApprovalTodo && b.tags.todoApprovalForPlanId === planId);

    const planReadyForApproval = planFinished && isLastTodo && !approvalExists;
    buildPlanCompleted = isBuildPlanCandidate && planReadyForApproval;
    userRequestPlanCompleted = isPlanModeUserRequestCandidate && planReadyForApproval;
}

// Tell listeners whether this completion also ends a build plan, so the per-todo chime can
// step aside for the plan-completed chime on the very last todo.
ab.links.utils.remoteShout({ name: 'onAnyTodoFinished', arg: { ...that, buildPlanCompleted } });

if (buildPlanCompleted) {
    ab.links.utils.remoteShout({ name: 'onAnyABBuildPlanCompleted', arg: { todoId: finishedTodo.id, planId } });
    ab.links.todo.spawnUserApprovalTodo(finishedTodo);
} else if (userRequestPlanCompleted) {
    ab.links.todo.spawnUserApprovalTodo(finishedTodo);
}
