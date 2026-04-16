return getBots((b) => {
    return b.space === 'shared' &&
           !b.tags.abIgnore &&
           !b.tags.abBot;
});
