const todoBot = that;

const data = todoBot.tags.userAskData;
if (!data || todoBot.tags.userAskAnswer == null) return;

setTag(todoBot, 'abTodoComplete', true);
setTag(todoBot, 'animationState', 'complete');
setTag(todoBot, 'userAskOtherText', null);
setTag(todoBot, 'todoShowArrow', false);

// Close the menu portal — the user is done with this question.
shout('abPatchTodoMenuReset');
configBot.masks.menuPortal = null;

// Find all sibling question todos in this chain (same todoPlanId)
const siblings = getBots(b =>
    b.tags.isUserAskTodo &&
    b.tags.todoPlanId === todoBot.tags.todoPlanId
);

// Case A: more user-ask todos remain — focus the next one and open its menu.
const nextTodo = siblings
    .filter(b => !b.tags.abTodoComplete)
    .sort((a, b) => (a.tags.todoOrder ?? 0) - (b.tags.todoOrder ?? 0))[0];

if (nextTodo) {
    os.focusOn(nextTodo, { duration: nextTodo.tags.todoFocusDuration }).catch(() => {});
    thisBot.abPatchTodoMenuOpen(nextTodo);
    return;
}

const parentTodo = getBot('id', todoBot.tags.todoParentId);
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

// User-ask todos stick around like other plan todos — they'll be moved to the log
// dimension when the parent plan is approved, or destroyed when it's undone.

// Signal the manager that the parent is ready to resume. Using `false` (not null) so the
// manager can distinguish "ready to resume" from "never paused".
setTag(parentTodo, 'awaitingUserResponse', false);

// Case B: chain complete — focus the parent todo and open its menu.
os.focusOn(parentTodo, { duration: parentTodo.tags.todoFocusDuration }).catch(() => {});
thisBot.abPatchTodoMenuOpen(parentTodo);
