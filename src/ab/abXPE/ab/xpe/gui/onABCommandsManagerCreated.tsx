let abCommands: ABCommandsManager = that;

abCommands.addCommand('xpeguireload', async (args) => {
    await thisBot.unmount();
    await thisBot.mount();
    console.log(`[xpeguireload] Reloaded the AB XPE GUI app.`);
}, {
    shortDescription: 'Reload the AB XPE GUI app.',
    usage: ['.xpeguireload']
});