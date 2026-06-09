if (!masks.menuOpen) return;

if (that?.todoId === thisBot.id) {
    ab.links.todo.abPatchTodoMenuOpen(thisBot);
}
