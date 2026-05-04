let abCommands: ABCommandsManager = that;

abCommands.addCommand('printconversationhistory', (args) => {
    let historyStorageBot = ab.links.remember;
    let source = 'ab.remember';

    if (args && args.length > 0) {
        const botId = args[0];
        const bot = getBot('id', botId);
        if (!bot) {
            ab.links.utils.abLogAndToast({ message: `.printconversationhistory — no bot found with id ${botId}`, logType: 'error' });
            return;
        }
        historyStorageBot = bot;
        source = botId;
    }

    const history = historyStorageBot.tags.abConversationHistory ?? [];
    console.log(`[${tags.system}.${tagName}] conversation history (${source}):`, ab.links.utils.abDebugFormatChatMessages(history));
}, {
    shortDescription: 'Log the conversation history stored on the ab remember bot, or on a specified bot.',
    longDescription: `Log the conversation history stored on the ab remember bot by default. If a bot id is provided, the command will look up the abConversationHistory tag on that bot and log it instead.`,
    usage: [
        '.printconversationhistory',
        '.printconversationhistory <botId>'
    ]
});
