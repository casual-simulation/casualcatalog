const askContext: ABAskContext = that.askContext;
const inquiry = askContext.originalUserInquiry;
const inquiryLabel = askContext.originalUserInquiryLabel;
const attachments = askContext.attachments ?? [];

// Block new requests while prior work is still pending — approvals waiting on the user, or
// any todos still in progress. Surface the right next action depending on which is blocking.
//
// This gate only applies to direct user submissions (chat send, voice input). Re-entrant
// calls from agent tools that spawn new plan todos (e.g. scaleModelPowerup's useTodoPlan)
// must be allowed through, otherwise the agent's own work would block itself.
const authBot = await os.requestAuthBotInBackground();
const userPendingTodos = getBots(b => b.tags.ownerId === authBot?.id && b.tags.abPatchTodoInstance && !b.tags.todoApproved);

if (askContext.userInitiated && userPendingTodos.length > 0) {
    const name = thisBot.abAskHelperGetAgentName({ askContext });
    const avatar = thisBot.abAskHelperGetAgentAvatar({ askContext });

    const approvalTodo = userPendingTodos.find(b => b.tags.isUserApprovalTodo);
    if (approvalTodo) {
        os.focusOn(approvalTodo, { duration: approvalTodo.tags.todoFocusDuration }).catch(() => {});
        ab.links.todo.abPatchTodoMenuOpen(approvalTodo);
        ab.links.utils.abLog({
            name,
            avatar,
            message: `Please approve, undo, or restart the pending ask before making a new request.`,
            space: 'shared',
        });
    } else {
        ab.links.utils.abLog({
            name,
            avatar,
            message: `There ${userPendingTodos.length === 1 ? 'is' : 'are'} still ${userPendingTodos.length} todo${userPendingTodos.length === 1 ? '' : 's'} in progress. Wait for the current work to finish (or cancel it) before making a new request.`,
            space: 'shared',
        });
    }
    return null;
}

const [userRequestTodo] = await thisBot.abAskToolMakeTodos({
    args: { todos: [{ prompt: inquiry, label: inquiryLabel, budget_credits: 1_000_000, attachments }] },
    askContext,
    returnType: 'bots',
    autoAssignAgent: false, // We will handle auto-assigning after creation so that it happens after any post-processing steps.
}) ?? [];

if (userRequestTodo) {
    userRequestTodo.tags.agentMode = 'plan';

    const autoAssignAgent = ab.links.personality.tags.abAutoAssignAgentToTodo ?? true;

    if (autoAssignAgent) {
        // Automatically assign the todo to agents.
        ab.links.todo.onAssignAgentsClick(userRequestTodo);
    }

    shout('onABUserRequestTodoCreated', { todoBot: userRequestTodo });
}

// First user ask in this inst becomes the inst directive — the inst's reason to exist.
if (!tags.abInstDirective) {
    setTagMask(thisBot, 'abInstDirective', inquiry, 'shared');
}

return userRequestTodo ?? null;
