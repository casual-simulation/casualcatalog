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

    // Defer the spawn while agent-spawned child plans (useTodoPlan etc.) are still in flight.
    // When the last descendant finishes, the ancestor walk below will re-check and spawn the
    // approval at that point.
    const planReadyForApproval = planFinished && isLastTodo && !approvalExists
        && !finishedTodo.abHasPendingDescendantPlans();
    buildPlanCompleted = isBuildPlanCandidate && planReadyForApproval;
    userRequestPlanCompleted = isPlanModeUserRequestCandidate && planReadyForApproval;
}

// Tell listeners whether this completion also ends a build plan, so the per-todo chime can
// step aside for the plan-completed chime on the very last todo.
ab.links.utils.remoteShout({ name: 'onAnyTodoFinished', arg: { ...that, buildPlanCompleted } });

if (buildPlanCompleted) {
    ab.links.utils.remoteShout({ name: 'onAnyABBuildPlanCompleted', arg: { todoId: finishedTodo.id, planId } });
    whisper(finishedTodo, 'spawnUserApprovalTodo');
} else if (userRequestPlanCompleted) {
    whisper(finishedTodo, 'spawnUserApprovalTodo');
}

// Walk up the parent chain — this completion may have been the last descendant blocking an
// ancestor plan's approval. For each ancestor whose plan is now fully done with no pending
// descendants and no existing approval, spawn its approval now. Only build-plan ancestors
// matter here: plan-mode user request todos with descendants (which any ancestor of ours has,
// by definition) never spawn their own approval — the descendant build plans cover them.
if (finishedTodo) {
    const seenPlans = new Set<string>([planId]);
    const seedPlanTodos = getBots(b =>
        b.tags.abPatchTodoInstance &&
        b.tags.todoPlanId === planId &&
        !b.tags.isUserApprovalTodo
    );
    const startingParentId = seedPlanTodos[0]?.tags.todoParentId;
    let cursor = startingParentId ? getBot('id', startingParentId) : null;

    while (cursor) {
        const cursorPlanId = cursor.tags.todoPlanId;
        if (!cursorPlanId || seenPlans.has(cursorPlanId)) break;
        seenPlans.add(cursorPlanId);

        const ancestorPlanTodos = getBots(b =>
            b.tags.abPatchTodoInstance &&
            b.tags.todoPlanId === cursorPlanId &&
            !b.tags.isUserApprovalTodo
        ).sort((a, b) => (a.tags.todoOrder ?? 0) - (b.tags.todoOrder ?? 0));

        const lastAncestorTodo = ancestorPlanTodos.at(-1);
        if (!lastAncestorTodo) break;

        const ancestorPlanFinished = ancestorPlanTodos.length > 0
            && ancestorPlanTodos.every(b => b.tags.abTodoComplete)
            && !ancestorPlanTodos.some(b => b.tags.abPatchError);
        const ancestorApprovalExists = !!getBot(b =>
            b.tags.isUserApprovalTodo && b.tags.todoApprovalForPlanId === cursorPlanId
        );
        const ancestorIsBuild =
            lastAncestorTodo.tags.agentMode === 'build'
            && !lastAncestorTodo.tags.isUserAskTodo
            && !lastAncestorTodo.tags.isUserApprovalTodo;

        if (ancestorPlanFinished && !ancestorApprovalExists && ancestorIsBuild
            && !lastAncestorTodo.abHasPendingDescendantPlans()) {
            ab.links.utils.remoteShout({
                name: 'onAnyABBuildPlanCompleted',
                arg: { todoId: lastAncestorTodo.id, planId: cursorPlanId },
            });
            whisper(lastAncestorTodo, 'spawnUserApprovalTodo');
        }

        const nextParentId = ancestorPlanTodos[0].tags.todoParentId;
        cursor = nextParentId ? getBot('id', nextParentId) : null;
    }
}
