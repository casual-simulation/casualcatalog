const askContext: ABAskContext = that.askContext;
const args = that.args ?? {};
const questions: any[] = Array.isArray(args.questions) ? args.questions : [];

const parentTodo = askContext.todoBot;

if (askContext.agentMode !== 'plan' || !parentTodo) {
    const name = thisBot.abAskHelperGetAgentName({ askContext });
    ab.links.utils.abLog({ name, message: 'askUser is only available in plan mode with an active todoBot — ignored.', logType: 'warn' });
    return;
}

if (questions.length === 0) {
    const name = thisBot.abAskHelperGetAgentName({ askContext });
    ab.links.utils.abLog({ name, message: 'askUser called with no questions — ignored.', logType: 'warn' });
    return;
}

// Build a sanitized askContext snapshot for the question todos to carry. Bots get reduced to
// their ids so the data round-trips through tag storage without circular refs. Transient
// fields (storedHistory, onPartialResponse) are intentionally omitted.
const askContextStorage = {
    sourceId: askContext.sourceId,
    abDimension: askContext.abDimension,
    abPosition: askContext.abPosition,
    patchBotDimension: askContext.patchBotDimension,
    patchBotPosition: askContext.patchBotPosition,
    hasInquiry: askContext.hasInquiry,
    model: askContext.model,
    agentMode: askContext.agentMode,
    callDepth: askContext.callDepth,
    recordName: askContext.recordName,
    menuType: askContext.menuType,
    menuActionData: askContext.menuActionData ? { ...askContext.menuActionData } : undefined,
    abBot: askContext.abBot?.id,
    todoBot: parentTodo.id,
    historyStorageBot: askContext.historyStorageBot?.id,
};

// Defensive: `menuActionData` is caller-shaped — any nested Bot refs become unserializable
// once we try to mod-tag-stringify. Sanitize them down to IDs.
if (askContextStorage.menuActionData) {
    thisBot.abAskHelperSanitizeBotReferences({ obj: askContextStorage.menuActionData });
}

const questionTodos = await thisBot.abAskToolMakeTodos({
    args: {
        todos: questions.map((q) => ({
            prompt: q.question,
            label: typeof q.question === 'string' && q.question.length > 60
                ? q.question.slice(0, 57) + '...'
                : q.question,
            budget_credits: 0,
        })),
    },
    askContext,
    returnType: 'bots',
}) ?? [];

for (let i = 0; i < questionTodos.length; i++) {
    const q = questions[i];
    const data = {
        questionType: q.questionType,
        question: q.question,
        options: Array.isArray(q.options) ? q.options : [],
        allowOther: q.allowOther !== false,
        askContext: askContextStorage,
    };
    setTag(questionTodos[i], 'isUserAskTodo', true);
    setTag(questionTodos[i], 'userAskData', '🧬' + JSON.stringify(data));
    setTag(questionTodos[i], 'todoReadyForAgent', false);
    setTag(questionTodos[i], 'onDestroy', '@whisper(thisBot, "userAskTodoOnDestroy")');
}

// Rebuild connection lines now that the chain bots have userAskData set so refreshConnections
// can include the parent agent todo on the order-0 question todo.
for (const t of questionTodos) {
    whisper(t, 'refreshConnections');
}

setTag(parentTodo, 'awaitingUserResponse', true);
setTag(parentTodo, 'animationState', 'incomplete');
