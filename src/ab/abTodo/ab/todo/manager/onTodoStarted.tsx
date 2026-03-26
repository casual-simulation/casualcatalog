if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] todo started:`, that?.todoId);
}

shout('onAnyTodoStarted', that);
