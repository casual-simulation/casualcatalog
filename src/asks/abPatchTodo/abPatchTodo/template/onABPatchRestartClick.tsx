const planTodos = getBots(b => b.tags.abPatchTodoInstance && b.tags.todoPlanId === tags.todoPlanId)
    .sort((a, b) => (b.tags.todoOrder ?? 0) - (a.tags.todoOrder ?? 0)); // reverse order

for (const todo of planTodos) {
    whisper(todo, 'abTodoResetState');
}

shout('abPatchTodoMenuReset');
