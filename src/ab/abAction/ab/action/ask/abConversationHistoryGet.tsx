const { historyStorageBot } = that ?? {};

assert(ab.links.utils.isBot(historyStorageBot), `[${tags.system}.${tagName}] historyStorageBot must be a Bot.`);

return historyStorageBot.tags.abConversationHistory ?? [];
