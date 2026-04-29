const { historyStorageBot } = that ?? {};

assert(ab.links.utils.isBot(historyStorageBot), `[${tags.system}.${tagName}] historyStorageBot must be a Bot.`);

setTagMask(historyStorageBot, 'abConversationHistory', null, historyStorageBot.space);

const name = thisBot.abAskHelperGetAgentName({ askContext: { abBot: historyStorageBot} });
ab.links.utils.abLog({ name, message: 'Conversation history cleared.' });