const todoBot = that;

shout('abPatchTodoMenuReset');
shout('onAnyABPatchApprove', { botId: todoBot.id });

if (todoBot.tags.debug) {
    console.log(`[${tags.system}.${tagName}] approve clicked on ${todoBot.tags.system} (planId=${todoBot.tags.todoPlanId})`);
}

const planTodos = getBots(b => b.tags.abPatchTodoInstance && b.tags.todoPlanId === todoBot.tags.todoPlanId);
const allTodos = thisBot.abExpandToDescendantTodos({ todos: planTodos });

if (todoBot.tags.debug) {
    console.log(`[${tags.system}.${tagName}] approving ${allTodos.length} todo(s) — moving to log dimension`);
}

if (allTodos.length > 0) {
    for (const todo of allTodos) {
        todo.tags.todoApproved = true;

        // Remove from previous dimension.
        const prevDim = todo.tags.dimension;
        const prevDimPos = prevDim ? getBotPosition(todo, prevDim) : new Vector(0, 0, 0);

        if (prevDim) {
            todo.tags[prevDim] = false;
            todo.tags[prevDim + 'X'] = null;
            todo.tags[prevDim + 'Y'] = null;
            todo.tags[prevDim + 'Z'] = null;
        }

        // Place in 'log' dimension.
        todo.tags.dimension = 'log';
        todo.tags['log'] = true;
        todo.tags['logX'] = prevDimPos.x;
        todo.tags['logY'] = prevDimPos.y;
        todo.tags['logZ'] = prevDimPos.z;
    }

    const username = await ab.links.console.getUserName();

    ab.links.utils.abLog({ message: `Todo plan ${todoBot.tags.todoPlanId} has been approved by ${username}. Moved todo bots to the "log" dimension.`, space: 'shared' });
}
