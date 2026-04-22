if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] todo started:`, that?.todoId);
}

ab.links.utils.remoteShout({ name: 'onAnyTodoStarted', arg: that});
