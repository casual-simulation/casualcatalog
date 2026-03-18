const historyBot = that?.historyStorageBot ?? ab.links.remember;
setTagMask(historyBot, 'abConversationHistory', [], 'shared');
links.utils.abLog({ message: 'Conversation history cleared.' });
