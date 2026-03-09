if (!thisBot.vars.appInstance) {
    thisBot.vars.appInstance = await thisBot.App();
    await os.registerApp(tags.system, thisBot);

    thisBot.forceUpdate();
}
