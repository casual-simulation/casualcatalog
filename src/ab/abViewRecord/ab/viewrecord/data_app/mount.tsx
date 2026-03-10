const {
    recordName
} = that ?? {};

if (!links.component) {
    await links.learn.abAdapt('abShell');
}

if (masks.active) {
    await thisBot.unmount();
}

const App = thisBot.App();

await os.registerApp(tags.appId, thisBot);
await os.compileApp(tags.appId, <App recordName={recordName} />);

thisBot.vars.onEscapeKeyPress = [];
masks.active = true;