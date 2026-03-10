const changes = that;

for (const change of changes) {
    if (change?.bot?.tags.consoleLogMessageBot === true) {
        // Init message bot id tracking set if needed.
        if (!thisBot.vars.messageBotIds) {
            thisBot.vars.messageBotIds = new Set();
        }

        if (!thisBot.vars.messageBotIds.has(change.bot.id)) {
            thisBot.vars.messageBotIds.add(change.bot.id);

            shout('onABConsoleLogMessageBotAdded', { consoleLogMessageBot: change.bot });
        } 

        if (change.tags.includes("message") || change.tags.includes("name") || change.tags.includes("timestamp") || change.tags.includes("consoleLogMessageBot")) {
            if (thisBot.vars.updateLog) thisBot.vars.updateLog();        
        }
    }
}