if (!masks.menuOpen) return;

if (that?.todoId === thisBot.id) {
    whisper(thisBot, 'abPatchTodoMenuOpen');
}
