const todoBot = that;

const planTodos = getBots(b => b.tags.abPatchTodoInstance && b.tags.todoPlanId === todoBot.tags.todoPlanId);
const failedTodo = planTodos.find(b => b.tags.abPatchError);

if (failedTodo) {
    thisBot.abTodoResetState(failedTodo);
}

// Clear failedPlanId so the manager auto-resumes
const manager = ab.links.todoManager;
if (manager) {
    setTagMask(manager, 'failedPlanId', null, 'shared');
}

shout('abPatchTodoMenuReset');
