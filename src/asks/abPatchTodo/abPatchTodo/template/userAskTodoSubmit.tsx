const data = tags.userAskData;
if (!data || tags.userAskAnswer == null) return;

setTag(thisBot, 'abTodoComplete', true);
setTag(thisBot, 'animationState', 'complete');
setTag(thisBot, 'userAskOtherText', null);
setTag(thisBot, 'todoShowArrow', false);

// Close the menu portal — the user is done with this question.
shout('abPatchTodoMenuReset');
configBot.masks.menuPortal = null;

// Find all sibling question todos in this chain (same todoPlanId)
const siblings = getBots(b =>
    b.tags.isUserAskTodo &&
    b.tags.todoPlanId === tags.todoPlanId
);

// Case A: more user-ask todos remain — focus the next one and open its menu.
const nextTodo = siblings
    .filter(b => !b.tags.abTodoComplete)
    .sort((a, b) => (a.tags.todoOrder ?? 0) - (b.tags.todoOrder ?? 0))[0];

if (nextTodo) {
    await os.focusOn(nextTodo, { duration: nextTodo.tags.todoFocusDuration });
    whisper(nextTodo, 'abPatchTodoMenuOpen');
    return;
}

const parentTodo = getBot('id', tags.todoParentId);
if (!parentTodo || parentTodo.tags.abTodoComplete || parentTodo.tags.abPatchError) return;

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

const userMessage = ab.links.ask.abAskHelperBuildUserMessage({
    askContext: askContextForMessage,
    extra: { functionResults: [{ name: 'askUser', result: resultEntries }] },
});

const history = ab.links.ask.abConversationHistoryGet({ historyStorageBot });
history.push({ role: 'user', content: [{ text: userMessage }] });
ab.links.ask.abConversationHistorySave({ historyStorageBot, history });

// Auto-approve the chain — moves all chain todos to the `log` dimension.
whisper(thisBot, 'onABPatchApproveClick');

// Signal the manager that the parent is ready to resume. Using `false` (not null) so the
// manager can distinguish "ready to resume" from "never paused".
setTag(parentTodo, 'awaitingUserResponse', false);

// Case B: chain complete — focus the parent todo and open its menu.
await os.focusOn(parentTodo, { duration: parentTodo.tags.todoFocusDuration });
whisper(parentTodo, 'abPatchTodoMenuOpen');
