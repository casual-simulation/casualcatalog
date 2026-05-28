const contextTodo = that?.askContext?.todoBot;
const requestedId = that?.args?.todoBotId;

// Complete the agent's actual in-progress todo, not whatever id the model passed. The model
// is told to echo context.todoId, but it sometimes parrots a stale id from earlier turns in
// the shared history — marking an already-finished todo, so the real one never gets
// abTodoComplete and both manager and agent hang forever.
const todoBot = contextTodo ?? (requestedId ? getBot('id', requestedId) : undefined);

if (!todoBot) {
    return;
}

if (tags.debug && requestedId && contextTodo && requestedId !== contextTodo.id) {
    console.warn(`[${tags.system}.${tagName}] completeTodo arg todoBotId ${requestedId} != active todo ${contextTodo.id}; completing active todo`);
}

todoBot.tags.abTodoComplete = true;
todoBot.tags.animationState = 'complete';
