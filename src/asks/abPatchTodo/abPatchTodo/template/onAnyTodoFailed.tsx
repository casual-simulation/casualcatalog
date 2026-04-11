if (!masks.menuOpen) return;

if (that?.planId === tags.todoPlanId) {
    whisper(thisBot, 'abPatchTodoMenuOpen');
}
