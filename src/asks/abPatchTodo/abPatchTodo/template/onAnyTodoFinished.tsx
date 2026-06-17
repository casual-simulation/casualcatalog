if (that?.todoId === thisBot.id) {
    if (masks.menuOpen) {
        ab.links.todo.abPatchTodoMenuOpen(thisBot);
    }

    
    // const isOwner = !thisBot.tags.ownerId || thisBot.tags.ownerId === authBot?.id; // Only chime on the owner's client(s).
    if (/*isOwner &&*/ !that.buildPlanCompleted) {
        ab.links.sound.abPlaySound({ value: 'ab/audio/todo_completed.mp3' });
    }
}
