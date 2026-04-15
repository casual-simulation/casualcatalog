const { historyStorageBot } = that ?? {};

assert(ab.links.utils.isBot(historyStorageBot), `[${tags.system}.${tagName}] historyStorageBot must be a Bot.`);

setTagMask(historyStorageBot, 'abConversationHistory', null, historyStorageBot.space);
ab.links.utils.abLog({ message: 'Conversation history cleared.' });