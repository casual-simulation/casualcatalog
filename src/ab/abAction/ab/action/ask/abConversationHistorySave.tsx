const { historyStorageBot, history } = that ?? {};

assert(ab.links.utils.isBot(historyStorageBot), `[${tags.system}.${tagName}] historyStorageBot must be a Bot.`);

const trimmed = history.length > tags.maxHistoryMessages
    ? [history[0], history[1], ...history.slice(history.length - (tags.maxHistoryMessages - 2))]
    : history;

setTagMask(historyStorageBot, 'abConversationHistory', trimmed, historyStorageBot.space);
