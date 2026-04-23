shout('onAnyABPatchApprove', { botId: thisBot.id });

const planTodos = getBots(b => b.tags.abPatchTodoInstance && b.tags.todoPlanId === tags.todoPlanId);
for (const todo of planTodos) {
    todo.tags.todoApproved = true;

    // Remove from previous dimension.
    const prevDim = todo.tags.dimension;
    const prevDimPos = prevDim ? getBotPosition(todo, prevDim) : new Vector(0, 0, 0);

    if (prevDim) {
        todo.tags[prevDim] = false;
    }

    // Place in 'log' dimension.
    todo.tags.dimension = 'log';
    todo.tags['log'] = true;
    todo.tags['logX'] = prevDimPos.x;
    todo.tags['logY'] = prevDimPos.y;
    todo.tags['logZ'] = prevDimPos.z;

    ab.links.utils.abLog(`Todo plan ${todo.tags.todoPlanId} has been approved. Moved todo bots to the "log" dimension.`)
}
