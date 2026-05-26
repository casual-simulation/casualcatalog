const { historyStorageBot, log = true } = that ?? {};

assert(ab.links.utils.isBot(historyStorageBot), `[${tags.system}.${tagName}] historyStorageBot must be a Bot.`);

setTagMask(historyStorageBot, 'abConversationHistory', null, historyStorageBot.space);

if (log) {
    const agentName = thisBot.abAskHelperGetAgentName({ askContext: { abBot: historyStorageBot} });
    const agentAvatar = thisBot.abAskHelperGetAgentAvatar({ askContext: { abBot: historyStorageBot} });
    const username = await ab.links.console.getUserName();

    ab.links.utils.abLog({ name: agentName, avatar: agentAvatar, message: `${username} has cleared my conversation history.`, space: 'shared' });
}