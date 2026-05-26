shout('abPatchTodoMenuReset');

// Already-approved approval bots in the log dimension shouldn't re-run the flow if clicked.
if (tags.todoApproved) {
    return;
}

setTag(thisBot, 'todoShowArrow', false);

const chain = thisBot.abCollectApprovalChain();
if (!chain || chain.plans.length === 0) {
    destroy(thisBot);
    return;
}

// Capture the topmost todo's location before the approval loop moves it to the log dimension.
let topmostManifestTarget: { dimension: string; position: { x: number; y: number } } | null = null;
if (chain.topmostTodo) {
    const topDim = chain.topmostTodo.tags.dimension;
    if (topDim) {
        topmostManifestTarget = {
            dimension: topDim,
            position: {
                x: chain.topmostTodo.tags[topDim + 'X'] ?? 0,
                y: chain.topmostTodo.tags[topDim + 'Y'] ?? 0,
            },
        };
    }
}

const allTodos = thisBot.abExpandToDescendantTodos({ todos: chain.allTodos });

// Archive the approval bot itself alongside the plan todos and stash ab's conversation
// history on it so the user can revisit this conversation later from the log dimension.
allTodos.push(thisBot);
setTag(thisBot, 'abTodoComplete', true);
setTag(thisBot, 'animationState', 'complete');
const historyStorageBot = ab.links.remember;
const archivedHistory = ab.links.ask.abConversationHistoryGet({ historyStorageBot });
setTag(thisBot, 'abConversationHistory', archivedHistory);

for (const todo of allTodos) {
    shout('onAnyABPatchApprove', { botId: todo.id });

    setTag(todo, 'todoApproved', true);

    // Remove from previous dimension.
    const prevDim = todo.tags.dimension;
    const prevDimPos = prevDim ? getBotPosition(todo, prevDim) : new Vector(0, 0, 0);

    if (prevDim) {
        todo.tags[prevDim] = false;
        todo.tags[prevDim + 'X'] = null;
        todo.tags[prevDim + 'Y'] = null;
        todo.tags[prevDim + 'Z'] = null;
    }

    todo.tags.dimension = 'log';
    todo.tags['log'] = true;
    todo.tags['logX'] = prevDimPos.x;
    todo.tags['logY'] = prevDimPos.y;
    todo.tags['logZ'] = prevDimPos.z;
}

const username = await ab.links.console.getUserName();
const planIds = chain.plans.map(p => p.planId).join(', ');
ab.links.utils.abLog({
    message: `Todo plan(s) ${planIds} have been approved by ${username}. Moved todo bots to the "log" dimension.`,
    space: 'shared',
});

// Clear ab's conversation history now that it has been archived on this approval bot —
// the next user request starts with a fresh slate.
ab.links.ask.abConversationHistoryClear({ historyStorageBot, log: false });

if (ab.links.manifestation.tags.abAwake && topmostManifestTarget) {
    const newAbBot = await ab.links.manifestation.abManifestBot(topmostManifestTarget);
    ab.links.manifestation.abClick();
    if (newAbBot) {
        os.focusOn(newAbBot, { duration: tags.todoFocusDuration });
    }
}
