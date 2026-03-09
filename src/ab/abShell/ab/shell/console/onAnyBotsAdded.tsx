const { bots } = that;

for (const newBot of bots) {
    if (newBot.tags.consoleLogMessageBot === true) {
        // Init message bot id tracking set if needed.
        if (!thisBot.vars.messageBotIds) {
            thisBot.vars.messageBotIds = new Set();
        }

        if (!thisBot.vars.messageBotIds.has(newBot.id)) {
            thisBot.vars.messageBotIds.add(newBot.id);
        }
        
        shout('onABConsoleLogMessageBotAdded', { consoleLogMessageBot: newBot });
    }
}