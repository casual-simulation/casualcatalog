if (!globalThis.ab || !ab.abIsPrimary() || !authBot) {
    return;
}

if (!thisBot.vars.appInstance) {
    thisBot.vars.appInstance = thisBot.App();
    await os.registerApp(tags.system, thisBot);

    const App = thisBot.vars.appInstance;
    os.compileApp(tags.system, <App/>)
}
