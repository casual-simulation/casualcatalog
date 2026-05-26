const planTodos = getBots(b => b.tags.abPatchTodoInstance && b.tags.todoPlanId === tags.todoPlanId);
const allTodos = thisBot.abExpandToDescendantTodos({ todos: planTodos });

// Undo applied todos in reverse todoOrder (each abPatchUndo destroys the todo bot itself)
const appliedTodos = allTodos.filter(b => b.tags.abPatchApplied).sort((a, b) => (b.tags.todoOrder ?? 0) - (a.tags.todoOrder ?? 0));
for (const todo of appliedTodos) {
    whisper(todo, 'abPatchUndo');
}

// Clear awaitingUserResponse on parent agent todos so cascading user-ask onDestroy handlers
// treat this as a deliberate undo rather than the user abandoning a clarification.
for (const todo of allTodos) {
    if (todo.tags.awaitingUserResponse === true) {
        setTag(todo, 'awaitingUserResponse', null);
    }
}

// Destroy all plan todos (including user-ask descendants).
destroy(allTodos);

const username = await ab.links.console.getUserName();

ab.links.utils.abLog({ message: `Todo plan ${tags.todoPlanId} has been cancelled by ${username}.`, space: 'shared' });

shout('abPatchTodoMenuReset');