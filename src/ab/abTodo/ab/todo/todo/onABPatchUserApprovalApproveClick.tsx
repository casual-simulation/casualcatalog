const todoBot = that;

shout('abPatchTodoMenuReset');

if (todoBot.tags.debug) {
    console.log(`[${tags.system}.${tagName}] approval-approve clicked on ${todoBot.tags.system} (approvalForPlanId=${todoBot.tags.todoApprovalForPlanId})`);
}

// Already-approved approval bots in the log dimension shouldn't re-run the flow if clicked.
if (todoBot.tags.todoApproved) {
    if (todoBot.tags.debug) {
        console.log(`[${tags.system}.${tagName}] already approved — skipping`);
    }
    return;
}

setTag(todoBot, 'todoShowArrow', false);

const chain = thisBot.abCollectApprovalChain(todoBot);
if (!chain || chain.plans.length === 0) {
    if (todoBot.tags.debug) {
        console.log(`[${tags.system}.${tagName}] no chain found — destroying self`);
    }
    destroy(todoBot);
    return;
}

if (todoBot.tags.debug) {
    console.log(`[${tags.system}.${tagName}] chain spans ${chain.plans.length} plan(s): [${chain.plans.map(p => p.planId).join(', ')}]`);
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

// Archive the approval bot itself alongside the plan todos.
allTodos.push(todoBot);
setTag(todoBot, 'abTodoComplete', true);
setTag(todoBot, 'animationState', 'complete');

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

if (ab.links.manifestation.tags.abAwake && topmostManifestTarget) {
    const newAbBot = await ab.links.manifestation.abManifestBot(topmostManifestTarget);
    ab.links.manifestation.abClick();
    if (newAbBot) {
        os.focusOn(newAbBot, { duration: todoBot.tags.todoFocusDuration }).catch(() => {});
    }
}
