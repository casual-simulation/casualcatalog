// Spawn a human-only approval todo bot adjacent to this (the last) plan todo.
// The approval todo has its own todoPlanId (a single-bot plan) and points its
// todoParentId at this bot so refreshConnections draws a connection line back.

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] spawning approval for plan ${tags.todoPlanId} from todo ${thisBot.id}`);
}

// Skip if any descendant plan already has a user-approval bot. That descendant approval's
// abCollectApprovalChain walk already covers this plan (and everything between), so spawning
// a second approval here would just be a redundant prompt for work the user can already act
// on at the deeper level. The deeper approval wins because it sits closer to the agent's
// most recent work — that's where the user's attention is.
const planTodos = getBots(b =>
    b.tags.abPatchTodoInstance &&
    b.tags.todoPlanId === tags.todoPlanId &&
    !b.tags.isUserApprovalTodo
);
const descendantTodos = thisBot.abExpandToDescendantTodos({ todos: planTodos });
const descendantPlanIds = new Set(descendantTodos.map(b => b.tags.todoPlanId).filter(id => id != null && id !== tags.todoPlanId));
const supersedingApproval = descendantPlanIds.size > 0
    ? getBot(b => b.tags.isUserApprovalTodo && descendantPlanIds.has(b.tags.todoApprovalForPlanId))
    : null;

if (supersedingApproval) {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] skipping — descendant approval ${supersedingApproval.id} (planId=${supersedingApproval.tags.todoApprovalForPlanId}) already covers this chain`);
    }
    return;
}

const dimension = tags.dimension ?? 'home';
const lastX = tags[dimension + 'X'] ?? 0;
const lastY = tags[dimension + 'Y'] ?? 0;

const shardBots = await ab.links.ask.abAskToolMakeTodos({
    args: {
        todos: [{
            prompt: 'Approve, undo, or restart this plan?',
            label: 'Ask Complete',
            // Bake the approval-specific tags into the shard so the bot reconstitutes with
            // them already set — refreshForm during initialize then sees isUserApprovalTodo
            // and picks the userApproval form on its first run, instead of racing with a
            // later setTag-triggered refresh.
            extraShardData: {
                isUserApprovalTodo: true,
                todoApprovalForPlanId: tags.todoPlanId,
            },
        }],
    },
    askContext: {
        abDimension: dimension,
        abPosition: { x: lastX, y: lastY },
        todoBot: thisBot,
    },
    returnType: 'bots',
    autoAssignAgent: false, // This todo is meant for human approval, not agent processing.
}) ?? [];

const approvalBot = shardBots.find(b => b.tags.abPatchTodoInstance);
if (!approvalBot) {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] approval spawn returned no patch-todo instance — aborting`);
    }
    return;
}

setTag(approvalBot, 'todoReadyForAgent', false);

// Archive ab's conversation history onto the approval bot and clear it now (at creation),
// not on user approve-click. The cleared history lets the next todo the manager assigns —
// often a descendant plan todo spawned by an agent tool like scaleModelWizard's
// useTodoPlan — start with a fresh storedHistory instead of inheriting the parent's
// completed conversation (which makes the AI think the task is already done and short-
// circuit with `completeTodo`).
const historyStorageBot = ab.links.remember;
if (historyStorageBot) {
    const archivedHistory = ab.links.ask.abConversationHistoryGet({ historyStorageBot });
    setTag(approvalBot, 'abConversationHistory', archivedHistory);
    ab.links.ask.abConversationHistoryClear({ historyStorageBot, log: false });
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] archived ${archivedHistory?.length ?? 0} message(s) onto approval bot ${approvalBot.id} and cleared ab conversation history`);
    }
}

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] spawned approval bot ${approvalBot.id} for plan ${tags.todoPlanId}`);
}
