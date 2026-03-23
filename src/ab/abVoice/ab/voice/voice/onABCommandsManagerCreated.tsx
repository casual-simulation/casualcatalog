let abCommands: ABCommandsManager = that;

abCommands.addCommand('humeclose', (args) => {
    thisBot.endHume();
}, {
    shortDescription: 'Close any currently open web socket to Hume.',
    usage: ['.humeclose']
});