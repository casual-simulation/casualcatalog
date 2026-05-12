const data = tags.userAskData;
if (!data || tags.userAskAnswer == null) return;

setTag(thisBot, 'abTodoComplete', true);
setTag(thisBot, 'animationState', 'complete');

const parentTodo = getBot('id', data.askContext?.todoBot);
if (!parentTodo || parentTodo.tags.abTodoComplete || parentTodo.tags.abPatchError) return;

// Find all sibling question todos in this chain (same todoPlanId)
const siblings = getBots(b =>
    b.tags.isUserAskTodo &&
    b.tags.todoPlanId === tags.todoPlanId
);
const allComplete = siblings.every(b => b.tags.abTodoComplete);

if (!allComplete) return;

// All complete — assemble result and append to history
const ordered = siblings
    .slice()
    .sort((a, b) => (a.tags.todoOrder ?? 0) - (b.tags.todoOrder ?? 0));

const resultEntries = ordered.map(b => ({
    questionType: b.tags.userAskData.questionType,
    answer: b.tags.userAskAnswer,
}));

const historyStorageBot = data.askContext.historyStorageBot
    ? getBot('id', data.askContext.historyStorageBot)
    : ab.links.remember;

const askContextForMessage = {
    ...data.askContext,
    todoBot: parentTodo,
    historyStorageBot,
    abBot: ab.links.manifestation.links.abBot,
};

const userMessage = ab.links.action.abAskHelperBuildUserMessage({
    askContext: askContextForMessage,
    extra: { functionResults: [{ name: 'askUser', result: resultEntries }] },
});

const history = ab.links.action.abConversationHistoryGet({ historyStorageBot });
history.push({ role: 'user', content: [{ text: userMessage }] });
ab.links.action.abConversationHistorySave({ historyStorageBot, history });

// Auto-approve the chain — moves all chain todos to the `log` dimension.
whisper(thisBot, 'onABPatchApproveClick');

// Re-render any open sibling menus so they switch to read-only mode.
for (const b of siblings) {
    whisper(b, 'abPatchTodoMenuOpen');
}

// Signal the manager that the parent is ready to resume. Using `false` (not null) so the
// manager can distinguish "ready to resume" from "never paused".
setTag(parentTodo, 'awaitingUserResponse', false);
