const { botIDs } = that;

for (const botId of botIDs) {
    if (thisBot.vars.messageBotIds) {
        const deleted = thisBot.vars.messageBotIds.delete(botId);

        if (deleted) {
            shout('onABConsoleLogMessageBotRemoved', { consoleLogMessageBotId: botId });
        }
    }
}