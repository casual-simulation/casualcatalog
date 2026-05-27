// Returns true if any todo descended from this bot's plan (via cross-plan todoParentId chains)
// is still in flight — neither abTodoComplete nor abPatchError. Used by the todo manager's
// onTodoFinished to defer spawning this plan's user approval while agent-spawned child plans
// (e.g. scaleModelPowerup's useTodoPlan path) are still running, so the user isn't asked to
// approve before the agent-driven follow-up work has actually finished.

const planId = tags.todoPlanId;
if (!planId) return false;

const planTodos = getBots(b =>
    b.tags.abPatchTodoInstance &&
    b.tags.todoPlanId === planId &&
    !b.tags.isUserApprovalTodo
);

if (planTodos.length === 0) return false;

const planTodoIds = new Set(planTodos.map(b => b.id));
const descendants = thisBot.abExpandToDescendantTodos({ todos: planTodos });

// abExpandToDescendantTodos seeds with the input and walks via todoParentId. Strip the seed
// plan's own todos — those are evaluated by the caller's existing planFinished check.
const externalDescendants = descendants.filter(b => !planTodoIds.has(b.id));
const pending = externalDescendants.filter(b => !b.tags.abTodoComplete && !b.tags.abPatchError);

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] plan ${planId}: ${externalDescendants.length} external descendant(s), ${pending.length} still pending` + (pending.length > 0 ? ` — [${pending.map(b => b.id).join(', ')}]` : ''));
}

return pending.length > 0;
