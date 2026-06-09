const todoBot = that;

const planTodos = getBots(b => b.tags.abPatchTodoInstance && b.tags.todoPlanId === todoBot.tags.todoPlanId)
    .sort((a, b) => (b.tags.todoOrder ?? 0) - (a.tags.todoOrder ?? 0)); // reverse order

if (todoBot.tags.debug) {
    console.log(`[${tags.system}.${tagName}] restart clicked on ${todoBot.tags.system} (planId=${todoBot.tags.todoPlanId}) — resetting ${planTodos.length} todo(s)`);
}

for (const todo of planTodos) {
    thisBot.abTodoResetState(todo);
}

shout('abPatchTodoMenuReset');
