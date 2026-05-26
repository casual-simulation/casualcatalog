const askContext: ABAskContext = that.askContext;
const inquiry = askContext.originalUserInquiry;
const inquiryLabel = askContext.originalUserInquiryLabel;
const attachments = askContext.attachments ?? [];

const [userRequestTodo] = await thisBot.abAskToolMakeTodos({
    args: { todos: [{ prompt: inquiry, label: inquiryLabel, budget_credits: 100000, attachments }] },
    askContext,
    returnType: 'bots',
    autoAssignAgent: false, // We will handle auto-assigning after creation so that it happens after any post-processing steps.
}) ?? [];

if (userRequestTodo) {
    userRequestTodo.tags.agentMode = 'plan';

    const autoAssignAgent = ab.links.personality.tags.abAutoAssignAgentToTodo ?? true;

    if (autoAssignAgent) {
        // Automatically assign the todo to agents.
        whisper(userRequestTodo, 'onAssignAgentsClick');
    }
    
    shout('onABUserRequestTodoCreated', { todoBot: userRequestTodo });
}
