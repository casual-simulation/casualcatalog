// Spawn a human-only approval todo bot adjacent to this (the last) plan todo.
// The approval todo has its own todoPlanId (a single-bot plan) and points its
// todoParentId at this bot so refreshConnections draws a connection line back.

const dimension = tags.dimension ?? 'home';
const lastX = tags[dimension + 'X'] ?? 0;
const lastY = tags[dimension + 'Y'] ?? 0;
const lastZ = tags[dimension + 'Z'] ?? 0;

// Plan todos are laid out along +y with spacing 2 (see abAskToolMakeTodos).
const todoSpacing = 2;
let approvalPosition = { x: lastX, y: lastY + todoSpacing, z: lastZ };

approvalPosition = await ab.links.utils.findOpenPositionAround({
    dimension,
    center: approvalPosition,
    radius: 15,
    innerRadius: 0,
    direction: 'outward',
    spacing: 1,
});

const approvalPlanId = uuid();
const planIdForApproval = tags.todoPlanId;
const parentTodoId = thisBot.id;

const abArtifactShard: ABArtifactShard = {
    data: {
        prompt: 'Approve, undo, or restart this plan?',
        todoLabel: 'Plan complete — review',
        todoPlanId: approvalPlanId,
        todoOrder: 0,
        todoParentId: parentTodoId,
        eggParameters: {
            gridInformation: {
                dimension,
                position: approvalPosition,
            }
        }
    },
    dependencies: [{ askID: 'abPatchTodo' }]
};

const shardBots = await ab.links.artifact.abCreateArtifactPromiseBot({
    abArtifactName: 'abPatchTodo',
    abArtifactInstanceID: uuid(),
    abArtifactShard
});

const approvalBot = shardBots?.find(b => b.tags.abPatchTodoInstance);
if (!approvalBot) return;

setTag(approvalBot, 'isUserApprovalTodo', true);
setTag(approvalBot, 'todoApprovalForPlanId', planIdForApproval);
setTag(approvalBot, 'todoReadyForAgent', false);
setTag(approvalBot, 'todoShowArrow', true);

whisper(approvalBot, 'refreshForm');
whisper(approvalBot, 'refreshConnections');

await os.focusOn(approvalBot, { duration: approvalBot.tags.todoFocusDuration });
whisper(approvalBot, 'abPatchTodoMenuOpen');
