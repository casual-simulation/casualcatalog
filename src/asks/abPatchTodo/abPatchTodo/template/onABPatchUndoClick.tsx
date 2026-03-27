const planTodos = getBots(b => b.tags.abPatchTodoInstance && b.tags.todoPlanId === tags.todoPlanId);

// Undo applied todos in reverse todoOrder (each abPatchUndo destroys the todo bot itself)
const appliedTodos = planTodos.filter(b => b.tags.abPatchApplied)
    .sort((a, b) => (b.tags.todoOrder ?? 0) - (a.tags.todoOrder ?? 0));
for (const todo of appliedTodos) {
    whisper(todo, 'abPatchUndo');
}

// Destroy remaining unapplied todos
const unappliedTodos = planTodos.filter(b => !b.tags.abPatchApplied);
for (const todo of unappliedTodos) {
    destroy(todo);
}

shout('abPatchTodoMenuReset');