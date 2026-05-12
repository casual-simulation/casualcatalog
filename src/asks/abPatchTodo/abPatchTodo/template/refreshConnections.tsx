if (!tags.todoPlanId) {
    tags.lineTo = null;
    return;
}

const planTodos = getBots(b => b.tags.abPatchTodoInstance && b.tags.todoPlanId === tags.todoPlanId)
    .sort((a, b) => (a.tags.todoOrder ?? 0) - (b.tags.todoOrder ?? 0));

const myIndex = planTodos.findIndex(b => b.id === thisBot.id);
const nextTodo = planTodos[myIndex + 1] ?? null;

const lineToSet: Bot[] = [];
if (nextTodo) lineToSet.push(nextTodo);

// User-ask question chains are anchored to the parent agent todo so the visual line links
// the parent into the clarification chain. Only the order-0 root carries this extra edge.
if (tags.isUserAskTodo && (tags.todoOrder ?? 0) === 0) {
    const parentTodoId = tags.userAskData?.askContext?.todoBot;
    if (parentTodoId) {
        const parentTodo = getBot('id', parentTodoId);
        if (parentTodo) lineToSet.push(parentTodo);
    }
}

if (lineToSet.length > 0 ) {
    tags.lineTo = getLink(lineToSet);
} else {
    tags.lineTo = null;
}