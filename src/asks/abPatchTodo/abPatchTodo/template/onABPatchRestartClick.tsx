const planTodos = getBots(b => b.tags.abPatchTodoInstance && b.tags.todoPlanId === tags.todoPlanId)
    .sort((a, b) => (b.tags.todoOrder ?? 0) - (a.tags.todoOrder ?? 0)); // reverse order

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] restart clicked on ${thisBot.id} (planId=${tags.todoPlanId}) — resetting ${planTodos.length} todo(s)`);
}

for (const todo of planTodos) {
    whisper(todo, 'abTodoResetState');
}

shout('abPatchTodoMenuReset');
