if (that?.todoId === thisBot.id) {
    if (masks.menuOpen) {
        whisper(thisBot, 'abPatchTodoMenuOpen');
    }

    // Skip the per-todo chime on the very last todo of a build plan — the plan-completed
    // chime fired by onAnyABBuildPlanCompleted covers it.
    if (!that.buildPlanCompleted) {
        ab.links.sound.abPlaySound({ value: 'ab/audio/todo_completed.mp3' });
    }
}
