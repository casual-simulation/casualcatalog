const { askContext } = that;
const inquiry = askContext.originalUserInquiry;
const label = typeof inquiry === 'string' ? inquiry.slice(0, 40) : 'User request';

const [userRequestTodo] = await thisBot.abAskToolMakeTodos({
    args: { todos: [{ prompt: inquiry, label, budget_credits: 500_000 }] },
    askContext,
    returnType: 'bots',
}) ?? [];

if (userRequestTodo) {
    userRequestTodo.tags.agentMode = 'plan';
}
