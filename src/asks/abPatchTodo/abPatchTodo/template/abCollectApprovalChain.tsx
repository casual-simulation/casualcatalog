// Walk from this approval todo's target plan up through todoParentId references,
// collecting every related plan's todos along the way. Returns the chain ordered
// nearest-first (the plan being approved, then its parent plan, ... up to the root).

const startPlanId = tags.todoApprovalForPlanId;
if (!startPlanId) {
    return { plans: [], allTodos: [], topmostTodo: null };
}

const plans: { planId: string; todos: Bot[] }[] = [];
const visited = new Set<string>();
let currentPlanId: string | null = startPlanId;
let topmostTodo: Bot | null = null;

while (currentPlanId && !visited.has(currentPlanId)) {
    visited.add(currentPlanId);

    const todos = getBots(b =>
        b.tags.abPatchTodoInstance &&
        b.tags.todoPlanId === currentPlanId &&
        !b.tags.isUserApprovalTodo
    );

    if (todos.length === 0) break;

    plans.push({ planId: currentPlanId, todos });

    const parentId = todos[0].tags.todoParentId;
    if (!parentId) {
        topmostTodo = todos.slice().sort((a, b) => (a.tags.todoOrder ?? 0) - (b.tags.todoOrder ?? 0))[0] ?? null;
        break;
    }

    const parentBot = getBot('id', parentId);
    if (!parentBot) {
        topmostTodo = todos.slice().sort((a, b) => (a.tags.todoOrder ?? 0) - (b.tags.todoOrder ?? 0))[0] ?? null;
        break;
    }

    currentPlanId = parentBot.tags.todoPlanId ?? null;
}

const allTodos: Bot[] = [];
for (const plan of plans) {
    allTodos.push(...plan.todos);
}

return { plans, allTodos, topmostTodo };
