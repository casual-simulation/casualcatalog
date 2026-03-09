if (!tags.autoSave) {
    return;
}

const { botIDs } = that;

for (const botId of botIDs) {
    if (thisBot.vars.homeWorldBotIDs) {
        const deleted = thisBot.vars.homeWorldBotIDs.delete(botId);

        if (deleted) {
            thisBot.processInstChange();
        }
    }
}