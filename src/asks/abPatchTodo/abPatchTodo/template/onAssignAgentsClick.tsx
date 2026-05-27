const planTodos = getBots(b =>
    b.tags.abPatchTodoInstance && b.tags.todoPlanId === tags.todoPlanId
);

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] assigning agents — marking ${planTodos.length} todo(s) ready (planId=${tags.todoPlanId})`);
}

for (const todo of planTodos) {
    setTag(todo, 'todoReadyForAgent', true);
    setTag(todo, 'todoShowArrow', false);
}
