const { historyStorageBot, history } = that ?? {};

assert(ab.links.utils.isBot(historyStorageBot), `[${tags.system}.${tagName}] historyStorageBot must be a Bot.`);

const MAX_HISTORY_MESSAGES = 40;

const trimmed = history.length > MAX_HISTORY_MESSAGES
    ? [history[0], history[1], ...history.slice(history.length - (MAX_HISTORY_MESSAGES - 2))]
    : history;

setTagMask(bot, 'abConversationHistory', trimmed, historyStorageBot.space);
