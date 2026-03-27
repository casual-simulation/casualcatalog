shout('onAnyABPatchApprove', { botId: thisBot.id });

const planTodos = getBots(b => b.tags.abPatchTodoInstance && b.tags.todoPlanId === tags.todoPlanId);
for (const todo of planTodos) {
    destroy(todo);
}
