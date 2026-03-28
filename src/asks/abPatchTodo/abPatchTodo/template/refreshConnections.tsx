if (!tags.todoPlanId) {
    tags.lineTo = null;
    return;
}

const planTodos = getBots(b => b.tags.abPatchTodoInstance && b.tags.todoPlanId === tags.todoPlanId)
    .sort((a, b) => (a.tags.todoOrder ?? 0) - (b.tags.todoOrder ?? 0));

const myIndex = planTodos.findIndex(b => b.id === thisBot.id);
const nextTodo = planTodos[myIndex + 1] ?? null;

tags.lineTo = nextTodo ? getLink(nextTodo) : null;
