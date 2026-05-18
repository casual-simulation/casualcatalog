if (masks.menuOpen && that?.todoId === thisBot.id) {
    whisper(thisBot, 'abPatchTodoMenuOpen');
}

// Spawn a human-only approval todo once every regular todo in this plan has completed.
// Guards: only the just-finished bot runs the spawn, and only for regular plan todos that
// aren't user-ask / user-approval todos themselves.
if (that?.todoId !== thisBot.id) return;
if (!tags.todoPlanId) return;
if (tags.isUserAskTodo || tags.isUserApprovalTodo) return;
if (tags.agentMode === 'plan') return;

const planTodos = getBots(b => b.tags.abPatchTodoInstance && b.tags.todoPlanId === tags.todoPlanId);
const allComplete = planTodos.length > 0 && planTodos.every(b => b.tags.abTodoComplete);
const anyFailed = planTodos.some(b => b.tags.abPatchError);

if (!allComplete || anyFailed) return;

const existingApproval = getBot(b => b.tags.isUserApprovalTodo && b.tags.todoApprovalForPlanId === tags.todoPlanId);
if (existingApproval) return;

const lastTodo = planTodos.slice().sort((a, b) => (a.tags.todoOrder ?? 0) - (b.tags.todoOrder ?? 0)).at(-1);
if (lastTodo?.id !== thisBot.id) return;

whisper(thisBot, 'spawnUserApprovalTodo');
