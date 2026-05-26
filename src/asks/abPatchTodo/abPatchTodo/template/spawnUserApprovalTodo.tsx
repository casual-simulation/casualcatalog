// Spawn a human-only approval todo bot adjacent to this (the last) plan todo.
// The approval todo has its own todoPlanId (a single-bot plan) and points its
// todoParentId at this bot so refreshConnections draws a connection line back.

const dimension = tags.dimension ?? 'home';
const lastX = tags[dimension + 'X'] ?? 0;
const lastY = tags[dimension + 'Y'] ?? 0;
const todoSpacing = ab.links.ask.tags.todoSpacing ?? 2;

const shardBots = await ab.links.ask.abAskToolMakeTodos({
    args: { todos: [{ prompt: 'Approve, undo, or restart this plan?', label: 'Plan complete — review' }] },
    askContext: {
        abDimension: dimension,
        abPosition: { x: lastX, y: lastY + todoSpacing },
        todoBot: thisBot,
    },
    returnType: 'bots',
    autoAssignAgent: false, // This todo is meant for human approval, not agent processing.
}) ?? [];

const approvalBot = shardBots.find(b => b.tags.abPatchTodoInstance);
if (!approvalBot) return;

setTag(approvalBot, 'isUserApprovalTodo', true);
setTag(approvalBot, 'todoApprovalForPlanId', tags.todoPlanId);
setTag(approvalBot, 'todoReadyForAgent', false);
