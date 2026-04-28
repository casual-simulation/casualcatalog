const { askContext } = that;
const inquiry = askContext.originalUserInquiry;
const inquiryLabel = askContext.originalUserInquiryLabel;

const [userRequestTodo] = await thisBot.abAskToolMakeTodos({
    args: { todos: [{ prompt: inquiry, label: inquiryLabel, budget_credits: 100000 }] },
    askContext,
    returnType: 'bots',
}) ?? [];

if (userRequestTodo) {
    userRequestTodo.tags.agentMode = 'plan';
}

shout('onABUserRequestTodoCreated', { todoBot: userRequestTodo });
