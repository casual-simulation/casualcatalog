if (thisBot.vars.appInstance) {    
    delete thisBot.vars.appInstance;
    await os.unregisterApp(tags.system);
}

if (thisBot.vars.refreshCreditsTimeoutId) {
    clearTimeout(thisBot.vars.refreshCreditsTimeoutId);
    thisBot.vars.refreshCreditsTimeoutId = null;
}