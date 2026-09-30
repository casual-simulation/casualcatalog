thisBot.abSelfSelectMenuOnBeforeCreate();

if (!authBot) {
    try { 
        await os.requestAuthBotInBackground();
    } catch {
        thisBot.vars.loading = false;
        return;
    }
}