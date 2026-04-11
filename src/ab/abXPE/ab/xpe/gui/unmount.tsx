if (thisBot.vars.appInstance) {
    delete thisBot.vars.appInstance;
    await os.unregisterApp(tags.system);
}
