// Spawn a human-only approval todo bot adjacent to this (the last) plan todo.
// The approval todo has its own todoPlanId (a single-bot plan) and points its
// todoParentId at this bot so refreshConnections draws a connection line back.

const todoBot = that;

if (todoBot.tags.debug) {
    console.log(`[${tags.system}.${tagName}] spawning approval for plan ${todoBot.tags.todoPlanId} from todo ${todoBot.tags.system}`);
}

const dimension = todoBot.tags.dimension ?? 'home';
const lastX = todoBot.tags[dimension + 'X'] ?? 0;
const lastY = todoBot.tags[dimension + 'Y'] ?? 0;

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
                todoApprovalForPlanId: todoBot.tags.todoPlanId,
            },
        }],
    },
    askContext: {
        abDimension: dimension,
        abPosition: { x: lastX, y: lastY },
        todoBot: todoBot,
    },
    returnType: 'bots',
    autoAssignAgent: false, // This todo is meant for human approval, not agent processing.
}) ?? [];

const approvalBot = shardBots.find(b => b.tags.abPatchTodoInstance);
if (!approvalBot) {
    if (todoBot.tags.debug) {
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
    if (todoBot.tags.debug) {
        console.log(`[${tags.system}.${tagName}] archived ${archivedHistory?.length ?? 0} message(s) onto approval bot ${approvalBot.id} and cleared ab conversation history`);
    }
}

if (todoBot.tags.debug) {
    console.log(`[${tags.system}.${tagName}] spawned approval bot ${approvalBot.id} for plan ${todoBot.tags.todoPlanId}`);
}
