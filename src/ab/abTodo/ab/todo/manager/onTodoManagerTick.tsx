if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] Starting tick`);
}


// If there's an active todo being processed, monitor it
if (tags.activeTodoId) {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] Monitoring active todo: ${tags.activeTodoId}`);
    }
    const todoBot = getBot('id', tags.activeTodoId);

    if (!todoBot) {
        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] Active todo was destroyed, marking finished`);
        }
        // Todo was destroyed — move to next
        thisBot.onTodoFinished({ todoId: tags.activeTodoId });
    } else if (todoBot.tags.abPatchError) {
        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] Active todo failed: ${todoBot.id}, error: ${todoBot.tags.abPatchError}`);
        }
        // Patch failed — stop this plan
        thisBot.onTodoFailed({ todoId: todoBot.id, planId: todoBot.tags.todoPlanId });
    } else if (todoBot.tags.abPatchApplied) {
        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] Active todo applied: ${todoBot.id}`);
        }
        // Patch applied — move to next
        thisBot.onTodoFinished({ todoId: todoBot.id });
    }
    return;
}

// No active todo — find the next one to process
const todoBots = thisBot.abGetTodoBots();
if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] Found ${todoBots?.length ?? 0} todo bots`);
}
if (!todoBots || todoBots.length === 0) {
    const idleAgent = tags.activeAgentId ? getBot('id', tags.activeAgentId) : null;
    if (idleAgent) {
        destroy(idleAgent);
        setTagMask(thisBot, 'activeAgentId', null, 'shared');
    }
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

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] Pending todos count: ${pendingTodos.length}`);
}

if (pendingTodos.length === 0) {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] No pending todos`);
    }
    const idleAgent = tags.activeAgentId ? getBot('id', tags.activeAgentId) : null;
    if (idleAgent) {
        destroy(idleAgent);
        setTagMask(thisBot, 'activeAgentId', null, 'shared');
    }
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

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] Selected next todo: ${pendingTodos[0].id} (planId: ${pendingTodos[0].tags.todoPlanId}, order: ${pendingTodos[0].tags.todoOrder})`);
}

const nextTodo = pendingTodos[0];
setTagMask(thisBot, 'activePlanId', nextTodo.tags.todoPlanId, 'shared');
setTagMask(thisBot, 'activeTodoId', nextTodo.id, 'shared');

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] Emitting onTodoStarted for: ${nextTodo.id}`);
}
thisBot.onTodoStarted({ todoId: nextTodo.id });

// Find or spawn an agent
let agentBot = tags.activeAgentId ? getBot('id', tags.activeAgentId) : null;

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] Agent state: activeAgentId=${tags.activeAgentId}, agentBot=${!!agentBot}`);
}

if (agentBot && nextTodo.tags.aiModel && agentBot.tags.aiModel !== nextTodo.tags.aiModel) {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] Agent model mismatch (agent: ${agentBot.tags.aiModel}, todo: ${nextTodo.tags.aiModel}), destroying old agent`);
    }
    destroy(agentBot);
    setTagMask(thisBot, 'activeAgentId', null, 'shared');
    agentBot = null;
}

if (!agentBot) {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] Spawning new agent for model: ${nextTodo.tags.aiModel}`);
    }
    const abBot = ab.links.manifestation.links.abBot;
    const dimension = configBot.tags.gridPortal ?? 'home';

    let agentPosition = {
        x: abBot.tags[dimension + 'X'] ?? 1,
        y: abBot.tags[dimension + 'Y'] ?? 0
    }

    const openPosition = await ab.links.utils.findOpenPositionAround({ originPosition: agentPosition, dimension });

    if (openPosition) {
        agentPosition = openPosition;
    }

    const lookupResult: ABLookupAskIDResult = await ab.links.search.onLookupAskID({
        askID: 'agent_bot_tool',
        eggParameters: {
            gridInformation: {
                dimension,
                position: agentPosition,
            },
            aiModel: nextTodo.tags.aiModel,
        }
    });
    
    const agentMakerBot = lookupResult?.hatchedBots?.find(b => b.tags.createAIAgent != null);
    
    if (agentMakerBot) {
        const aiChatModels = configBot.tags.aiChatModels ?? (await ai.listChatModels());
        const match = aiChatModels.find(e => e.name === nextTodo.tags.aiModel);

        agentBot = agentMakerBot.createAIAgent({
            dimension,
            aiModel: match.name,
            aiProvider: match.provider
        })
    } else {
        console.error(`[${tags.system}.${tagName}] could not find agent bot maker in agent_bot_tool ask.`)
    }

    if (!agentBot) {
        if (tags.debug) {
            console.error(`[${tags.system}.${tagName}] Could not create AI agent`);
        }
        links.utils.abLog({ message: 'Could not create AI agent' });
        setTagMask(thisBot, 'activeTodoId', null, 'shared');
        return;
    }
}

setTagMask(thisBot, 'activeAgentId', agentBot.id, 'shared');

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] Assigning todo ${nextTodo.id} to agent ${agentBot.id}`);
}
// Assign the todo to the agent
whisper(agentBot, 'assignTodo', nextTodo.id);
