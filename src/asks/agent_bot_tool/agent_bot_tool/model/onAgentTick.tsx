const { intervalMS } = that ?? {};

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
    // Move multiple tiles per tick based on moveSpeed (tiles/sec) and tick interval.
    const tilesPerTick = Math.max(1, Math.round((tags.moveSpeed ?? 2) * intervalMS / 1000));

    tags[dim] = true;
    for (let i = 0; i < tilesPerTick; i++) {
        const curX = tags[dim + 'X'] ?? 0;
        const curY = tags[dim + 'Y'] ?? 0;
        const curDx = curX - todoX;
        const curDy = curY - todoY;
        const curDist = Math.sqrt(curDx * curDx + curDy * curDy);

        if (curDist <= targetDist) break;

        // If right on top of the todo, default to +x side.
        const nx = curDist > 0 ? curDx / curDist : 1;
        const ny = curDist > 0 ? curDy / curDist : 0;
        const targetX = todoX + nx * targetDist;
        const targetY = todoY + ny * targetDist;

        if (Math.abs(targetX - curX) >= Math.abs(targetY - curY)) {
            tags[dim + 'X'] = curX + Math.sign(targetX - curX);
        } else {
            tags[dim + 'Y'] = curY + Math.sign(targetY - curY);
        }
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