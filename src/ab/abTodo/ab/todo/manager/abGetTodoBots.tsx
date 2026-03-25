const todoBots = getBots((b) => {
    return b.tags.abPatchTodo &&
           b.tags.abPatchTodoInstance
});

return todoBots;