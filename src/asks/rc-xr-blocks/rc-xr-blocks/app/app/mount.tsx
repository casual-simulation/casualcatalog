if (!thisBot.vars.appInstance) {
    thisBot.vars.appInstance = thisBot.App();
    await os.registerApp(tags.appId, thisBot);

    thisBot.refresh();
}