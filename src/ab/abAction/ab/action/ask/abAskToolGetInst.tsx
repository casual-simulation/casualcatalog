return getBots((b) => {
    return b.space === 'shared' && // Only include shared bots.
           !b.tags.abIgnore && // Ignore bots that should be ignored.
           !b.tags.abBot && // Ignore ab bots.
           !b.tags.abPatchTodoInstance; // Ignore todo bots.
});
