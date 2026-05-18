if (that?.todoId === thisBot.id) {
    if (masks.menuOpen) {
        whisper(thisBot, 'abPatchTodoMenuOpen');
    }

    ab.links.sound.abPlaySound({ value: 'ab/audio/todo_completed.mp3' });
}
