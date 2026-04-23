const cycleId = that?.cycleId;

function isStaleCycle() {
    return cycleId != null && thisBot.vars.currentCycleId !== cycleId;
}

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
    } else if (todoBot.tags.abTodoComplete) {
        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] Active todo complete: ${todoBot.id}`);
        }
        // Force a fresh snapshot to compute cost before moving on
        if (globalThis.abXPE && todoBot.tags.creditSnapshotStart != null) {
            await abXPE.abXPERefreshCredits();
            if (isStaleCycle()) { return; }

            const availableCredits = abXPE.masks.availableCredits ?? {};
            const budgetRecordName = todoBot.tags.budgetRecordName;
            const endCredits = (budgetRecordName && budgetRecordName !== authBot.id)
                ? availableCredits.studioCredits
                : availableCredits.userCredits;

            if (endCredits != null) {
                todoBot.tags.creditSnapshotEnd = endCredits;
            }
        }
        // Patch applied — move to next
        thisBot.onTodoFinished({ todoId: todoBot.id });
    } else {
        // Todo still pending — verify an agent is actually working on it
        const agentBot = tags.activeAgentId ? getBot('id', tags.activeAgentId) : null;
        if (!agentBot || agentBot.links.todoBot?.id !== tags.activeTodoId) {
            if (tags.debug) {
                console.log(`[${tags.system}.${tagName}] No agent working on active todo ${tags.activeTodoId}, resetting for re-assignment`);
            }
            setTagMask(thisBot, 'activeTodoId', null, 'shared');
            setTagMask(thisBot, 'activeAgentId', null, 'shared');
        }
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

// Filter to pending todos (no patch yet, not from a failed plan, and user has readied them)
const pendingTodos = todoBots.filter(b =>
    !b.tags.abPatchCode &&
    !b.tags.abTodoComplete &&
    !b.tags.abPatchError &&
    !b.tags.abPatchApplying &&
    b.tags.todoPlanId !== tags.failedPlanId &&
    b.tags.todoReadyForAgent
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

const todoAgentName = nextTodo.tags.agentName;
const mismatch = todoAgentName
    ? agentBot?.tags.agentName !== todoAgentName
    : (nextTodo.tags.aiModel && agentBot?.tags.aiModel !== nextTodo.tags.aiModel);

if (agentBot && mismatch) {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] Agent mismatch (agent: ${agentBot.tags.agentName ?? agentBot.tags.aiModel}, todo: ${todoAgentName ?? nextTodo.tags.aiModel}), destroying old agent`);
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
        x: abBot?.tags[dimension + 'X'] ?? 1,
        y: abBot?.tags[dimension + 'Y'] ?? 0
    }

    const openPosition = await ab.links.utils.findOpenPositionAround({ center: agentPosition, dimension, direction: 'inward' });

    if (isStaleCycle()) {
        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] Stale cycle detected after findOpenPositionAround, aborting`);
        }
        return;
    }

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
            openMenu: false,
        }
    });

    if (isStaleCycle()) {
        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] Stale cycle detected after onLookupAskID, aborting`);
        }
        return;
    }

    const agentMakerBot = lookupResult?.hatchedBots?.find(b => b.tags.createAIAgent != null);

    if (agentMakerBot) {
        if (nextTodo.tags.agentName) {
            const customAgents = await ab.links.utils.abCollectCustomAgentConfigs();

            if (isStaleCycle()) {
                if (tags.debug) {
                    console.log(`[${tags.system}.${tagName}] Stale cycle detected after abCollectCustomAgentConfigs, aborting`);
                }
                return;
            }

            const customAgent = customAgents.find(a => a.agentName === nextTodo.tags.agentName);
            if (customAgent) {
                const { aiModel, aiProvider, group, ...customAgentConfig } = customAgent;
                agentBot = agentMakerBot.createAIAgent({ dimension, aiModel, aiProvider, customAgentConfig });
            }
        } else {
            const aiChatModels = configBot.tags.aiChatModels ?? (await ai.listChatModels());

            if (isStaleCycle()) {
                if (tags.debug) {
                    console.log(`[${tags.system}.${tagName}] Stale cycle detected after listChatModels, aborting`);
                }
                return;
            }

            const match = aiChatModels?.find(e => e.name === nextTodo.tags.aiModel);
            if (match) {
                agentBot = agentMakerBot.createAIAgent({ dimension, aiModel: match.name, aiProvider: match.provider });
            }
        }
    } else {
        console.error(`[${tags.system}.${tagName}] could not find agent bot maker in agent_bot_tool ask.`)
    }

    if (!agentBot) {
        if (tags.debug) {
            console.error(`[${tags.system}.${tagName}] Could not create AI agent`);
        }
        ab.links.utils.abLog({ message: 'Could not create AI agent' });
        setTagMask(thisBot, 'activeTodoId', null, 'shared');
        return;
    }
}

setTagMask(thisBot, 'activeAgentId', agentBot.id, 'shared');

// Force a fresh credits snapshot before agent starts to minimize cross-todo contamination
if (globalThis.abXPE) {
    await abXPE.abXPERefreshCredits();
    if (isStaleCycle()) { return; }

    const availableCredits = abXPE.masks.availableCredits ?? {};
    const budgetRecordName = nextTodo.tags.budgetRecordName;
    const creditSnapshotStart = (budgetRecordName && budgetRecordName !== authBot.id)
        ? availableCredits.studioCredits
        : availableCredits.userCredits;
    nextTodo.tags.creditSnapshotStart = creditSnapshotStart ?? null;
}

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] Assigning todo ${nextTodo.id} to agent ${agentBot.id}`);
}
// Assign the todo to the agent
whisper(agentBot, 'assignTodo', nextTodo.id);
