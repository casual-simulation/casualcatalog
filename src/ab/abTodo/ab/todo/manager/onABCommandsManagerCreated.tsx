let abCommands: ABCommandsManager = that;

abCommands.addCommand('destroytodos', (args) => {
    const todoBots = getBots(b => b.tags.abPatchTodoInstance);
    const count = todoBots.length;
    destroy(todoBots);

    console.log(`[destroytodos] Destroyed ${count} todo bots.`);
}, {
    shortDescription: 'Destroy all todo bots in the inst.',
    usage: ['.destroytodos']
});