if (!links.todoBot || tags.todoInProgress) {
    return;
}

const todoBot = links.todoBot;
const dim = todoBot.tags.dimension;

const todoX = todoBot.tags[dim + 'X'] ?? 0;
const todoY = todoBot.tags[dim + 'Y'] ?? 0;

const agentX = tags[dim + 'X'] ?? 0;
const agentY = tags[dim + 'Y'] ?? 0;

const dx = agentX - todoX;
const dy = agentY - todoY;
const dist = Math.sqrt(dx * dx + dy * dy);
const targetDist = tags.targetDistance ?? 2;

if (dist > targetDist) {
    // Move one tile orthogonally toward the stop point (targetDist tiles from the todo).
    // If the agent is right on top of the todo, default to +x side.
    const nx = dist > 0 ? dx / dist : 1;
    const ny = dist > 0 ? dy / dist : 0;
    const targetX = todoX + nx * targetDist;
    const targetY = todoY + ny * targetDist;

    tags[dim] = true;
    if (Math.abs(targetX - agentX) >= Math.abs(targetY - agentY)) {
        tags[dim + 'X'] = agentX + Math.sign(targetX - agentX);
    } else {
        tags[dim + 'Y'] = agentY + Math.sign(targetY - agentY);
    }
    return;
}

//check for arm extended
if (!links.armBot) {
    links.arm_tool.abCreateArm({
        originBot: thisBot,
        dimension: dim,
        position: {
            x: todoX,
            y: todoY,
            z: 0
        }
    })
    tags.agentArm = `🧬${JSON.stringify({ dimension: dim, position: { x: todoX, y: todoY } })}`;
    return;
}

//work on todo
setTag(todoBot, 'animationState', 'processing');

const requestData = {};
if (thisBot.links.armBot) {
    const armBot = links.armBot;
    const armDimension = armBot.tags.dimension;

    requestData.armDimension = armDimension;
    requestData.armDimensionX = armBot.tags[armDimension + "X"];
    requestData.armDimensionY = armBot.tags[armDimension + "Y"];
}

masks.targetBot = getLink(todoBot);
masks.promptType = 'grid';
thisBot.agentOnRequest({
    inquiry: todoBot.tags.prompt,
    data: requestData,
    model: tags.aiModel,
    todoBotId: todoBot.id,
});

tags.todoInProgress = true;