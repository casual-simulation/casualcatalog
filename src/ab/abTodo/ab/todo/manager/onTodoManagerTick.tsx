// If there's an active todo being processed, monitor it
if (tags.activeTodoId) {
    const todoBot = getBot(byID(tags.activeTodoId));

    if (!todoBot) {
        // Todo was destroyed — move to next
        thisBot.onTodoFinished({ todoId: tags.activeTodoId });
    } else if (todoBot.tags.abPatchError) {
        // Patch failed — stop this plan
        thisBot.onTodoFailed({ todoId: todoBot.id, planId: todoBot.tags.todoPlanId });
    } else if (todoBot.tags.abPatchApplied) {
        // Patch applied — move to next
        thisBot.onTodoFinished({ todoId: todoBot.id });
    }
    return;
}

// No active todo — find the next one to process
const todoBots = thisBot.abGetTodoBots();
if (!todoBots || todoBots.length === 0) {
    return;
}

// Filter to pending todos (no patch yet, not from a failed plan)
const pendingTodos = todoBots.filter(b =>
    !b.tags.abPatchCode &&
    !b.tags.abPatchApplied &&
    !b.tags.abPatchError &&
    !b.tags.abPatchApplying &&
    b.tags.todoPlanId !== tags.failedPlanId
);

if (pendingTodos.length === 0) {
    return;
}

// Sort: active plan first, then by todoOrder within plan
pendingTodos.sort((a, b) => {
    if (a.tags.todoPlanId !== b.tags.todoPlanId) {
        if (tags.activePlanId) {
            if (a.tags.todoPlanId === tags.activePlanId) return -1;
            if (b.tags.todoPlanId === tags.activePlanId) return 1;
        }
        return (a.tags.todoPlanId ?? '').localeCompare(b.tags.todoPlanId ?? '');
    }
    return (a.tags.todoOrder ?? 0) - (b.tags.todoOrder ?? 0);
});

const nextTodo = pendingTodos[0];
tags.activePlanId = nextTodo.tags.todoPlanId;
tags.activeTodoId = nextTodo.id;

thisBot.onTodoStarted({ todoId: nextTodo.id });

// Find or spawn an agent
let agentBot = tags.activeAgentId ? getBot(byID(tags.activeAgentId)) : null;

if (!agentBot) {
    agentBot = getBot('abAgent', true);
}

if (!agentBot) {
    const abBot = ab.links.manifestation.links.abBot;
    const dimension = configBot.tags.gridPortal ?? 'home';
    await ab.links.search.onLookupAskID({
        askID: 'agent_bot_tool',
        eggParameters: {
            gridInformation: {
                dimension,
                position: {
                    x: abBot.tags[dimension + 'X'] ?? 1,
                    y: abBot.tags[dimension + 'Y'] ?? 0
                }
            },
            aiModel: nextTodo.tags.aiModel,
        }
    });

    agentBot = getBot('abAgent', true);
    if (!agentBot) {
        links.utils.abLog({ message: 'Could not create AI agent' });
        tags.activeTodoId = null;
        return;
    }
}

tags.activeAgentId = agentBot.id;

// Assign the todo to the agent
whisper(agentBot, 'assignTodo', nextTodo.id);
