const todoBot = that;

const planTodos = getBots(b =>
    b.tags.abPatchTodoInstance && b.tags.todoPlanId === todoBot.tags.todoPlanId
);

if (todoBot.tags.debug) {
    console.log(`[${tags.system}.${tagName}] assigning agents for ${todoBot.tags.system} — marking ${planTodos.length} todo(s) ready (planId=${todoBot.tags.todoPlanId})`);
}

for (const todo of planTodos) {
    setTag(todo, 'todoReadyForAgent', true);
    setTag(todo, 'todoShowArrow', false);
}
