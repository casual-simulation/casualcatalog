const askContext: ABAskContext = that.askContext;
const inquiry = askContext.originalUserInquiry;
const inquiryLabel = askContext.originalUserInquiryLabel;
const attachments = askContext.attachments ?? [];

const [userRequestTodo] = await thisBot.abAskToolMakeTodos({
    args: { todos: [{ prompt: inquiry, label: inquiryLabel, budget_credits: 100000, attachments }] },
    askContext,
    returnType: 'bots',
}) ?? [];

if (userRequestTodo) {
    userRequestTodo.tags.agentMode = 'plan';
}

// Automatically assign the todo to agents.
whisper(userRequestTodo, 'onAssignAgentsClick');

shout('onABUserRequestTodoCreated', { todoBot: userRequestTodo });
