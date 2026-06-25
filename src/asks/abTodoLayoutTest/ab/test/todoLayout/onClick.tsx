// Throwaway test bot: eyeball the real production todo layout without running agents.
//   left-click  : add one "build" chain off a persistent "user request" plan todo
//   right-click : destroy every todo this spawner made and reset
//
// Calls abAskToolMakeTodos exactly like production (no layout overrides), so the layout it
// shows is the production layout. abPosition stands in for the agent's position (which sits by
// the todo); here we use the plan todo's own position. Spawned todos are tagged
// testLayoutSpawnerId for right-click cleanup (set after creation since reconstitute only
// copies a fixed set of shard fields).

const dimension =
    that?.dimension ??
    thisBot.tags.dimension ??
    configBot.tags.gridPortal ??
    configBot.tags.mapPortal ??
    'home';

const STEPS_PER_CHAIN = 3; // build todos per chain

// ── right-click: tear down everything this spawner made ──────────────────────
if (that?.modality === 'mouse' && that?.buttonId === 'right') {
    const spawned = getBots('testLayoutSpawnerId', thisBot.id);
    for (const b of spawned) {
        destroy(b);
    }
    tags.testPlanTodoId = null;
    tags.testChainCount = 0;
    os.toast(`Test: deleted ${spawned.length} todo bot(s).`);
    return;
}

// ── left-click: find (or create) the plan todo, then add one chain off it ────
let parentBot = tags.testPlanTodoId ? getBot('id', tags.testPlanTodoId) : null;

if (!parentBot) {
    // Plan/user-request todo at the spawner's position — the abAskHelperCreateUserRequestTodo shape.
    const baseX = thisBot.tags[dimension + 'X'] ?? 0;
    const baseY = thisBot.tags[dimension + 'Y'] ?? 0;

    const parentBots = await ab.links.ask.abAskToolMakeTodos({
        args: {
            todos: [{
                prompt: 'TEST: user request — verify todo layout direction.',
                label: 'Test Request',
                budget_credits: 0,
                extraShardData: {
                    isUserRequestTodo: true,
                    agentMode: 'plan',
                },
            }],
        },
        askContext: {
            abDimension: dimension,
            abPosition: { x: baseX, y: baseY },
        },
        returnType: 'bots',
        autoFocus: false,       // don't yank the camera — we want to see the whole layout
        autoAssignAgent: false, // layout test only; no real agent execution
    }) ?? [];

    parentBot = parentBots.find(b => b.tags.abPatchTodoInstance);

    if (!parentBot) {
        os.toast('Test: failed to create parent todo.');
        return;
    }

    parentBot.tags.testLayoutSpawnerId = thisBot.id;
    tags.testPlanTodoId = parentBot.id;
    tags.testChainCount = 0;
}

// Add one build chain off the plan todo, like the AI's `makeTodos` call mid-execution:
// pass todoBot (lineage) + abPosition (the agent's spot, here the plan todo's position).
const chainNum = (tags.testChainCount ?? 0) + 1;
const parentX = parentBot.tags[dimension + 'X'] ?? 0;
const parentY = parentBot.tags[dimension + 'Y'] ?? 0;

const chainBots = await ab.links.ask.abAskToolMakeTodos({
    args: {
        todos: Array.from({ length: STEPS_PER_CHAIN }, (_, s) => ({
            prompt: `TEST: chain ${chainNum} build step ${s + 1}`,
            label: `C${chainNum}.${s + 1}`,
            budget_credits: 0,
        })),
    },
    askContext: {
        abDimension: dimension,
        abPosition: { x: parentX, y: parentY },
        todoBot: parentBot,
    },
    returnType: 'bots',
    autoFocus: false,
    autoAssignAgent: false,
}) ?? [];

for (const b of chainBots) {
    if (b.tags.abPatchTodoInstance) {
        b.tags.testLayoutSpawnerId = thisBot.id;
    }
}

tags.testChainCount = chainNum;

os.focusOn(parentBot, { duration: 0.5 }).catch(() => {});
os.toast(`Test: added chain ${chainNum} (${STEPS_PER_CHAIN} todos).`);
