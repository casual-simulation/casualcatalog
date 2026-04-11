if (!masks.menuOpen) return;

const finishedTodo = getBot('id', that?.todoId);
if (finishedTodo?.tags.todoPlanId === tags.todoPlanId) {
    whisper(thisBot, 'abPatchTodoMenuOpen');
}
