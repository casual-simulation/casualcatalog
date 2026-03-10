const {
    abCommandsManager,
    selectedCommand
} = that ?? {};

if (masks.active) {
    await thisBot.unmount();
}

const App = thisBot.App();

await os.registerApp(tags.appId, thisBot);
await os.compileApp(tags.appId, <App commands={abCommandsManager.commands} initialSelectedCommand={selectedCommand}/>);

thisBot.vars.onEscapeKeyPress = [];
masks.active = true;