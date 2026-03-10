if (thisBot.vars.appInstance) {
    thisBot.vars = {};
    clearTagMasksStartingWith(thisBot, 'app_');
    await os.unregisterApp(tags.appId);
}