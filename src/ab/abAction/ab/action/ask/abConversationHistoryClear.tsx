const { historyStorageBot } = that ?? {};

assert(ab.links.utils.isBot(historyStorageBot), `[${tags.system}.${tagName}] historyStorageBot must be a Bot.`);

setTagMask(historyStorageBot, 'abConversationHistory', null, historyStorageBot.space);

const agentName = thisBot.abAskHelperGetAgentName({ askContext: { abBot: historyStorageBot} });
const username = await ab.links.console.getUserName();

ab.links.utils.abLog({ name: agentName, message: `${username} has cleared my conversation history.`, space: 'shared' });