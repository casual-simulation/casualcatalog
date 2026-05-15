if (!tags.todoPlanId) {
    tags.lineTo = null;
    return;
}

const lineToSet: Bot[] = [];

const planTodos = getBots(b => b.tags.abPatchTodoInstance && b.tags.todoPlanId === tags.todoPlanId)
    .sort((a, b) => (a.tags.todoOrder ?? 0) - (b.tags.todoOrder ?? 0));

const myIndex = planTodos.findIndex(b => b.id === thisBot.id);
const nextTodo = planTodos[myIndex + 1] ?? null;

if (nextTodo) {
    lineToSet.push(nextTodo);
}

// First child todo in a plan should always draw a connection line to its parent.
if (tags.todoParentId && (tags.todoOrder ?? 0) === 0) {
    const todoParentBot = getBot('id', tags.todoParentId);
    if (todoParentBot) {
        lineToSet.push(todoParentBot);
    }
}

if (lineToSet.length > 0 ) {
    tags.lineTo = getLink(lineToSet);
} else {
    tags.lineTo = null;
}