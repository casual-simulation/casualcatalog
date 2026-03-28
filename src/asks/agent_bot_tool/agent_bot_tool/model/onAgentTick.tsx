if (!links.todoBot || tags.todoInProgress) {
    return;
}

const todoBot = links.todoBot;

//check for closeness
const xPos = todoBot.tags[todoBot.tags.dimension + 'X'];
const yPos = todoBot.tags[todoBot.tags.dimension + 'Y'];

const agentXPos = (tags[todoBot.tags.dimension + 'X'] && tags[todoBot.tags.dimension + 'X'] > todoBot.tags[todoBot.tags.dimension + 'X']) ? todoBot.tags[todoBot.tags.dimension + 'X'] + 3 : todoBot.tags[todoBot.tags.dimension + 'X'] - 3;
const agentYPos = (tags[todoBot.tags.dimension + 'Y'] && tags[todoBot.tags.dimension + 'Y'] > todoBot.tags[todoBot.tags.dimension + 'Y']) ? todoBot.tags[todoBot.tags.dimension + 'Y'] + 3 : todoBot.tags[todoBot.tags.dimension + 'Y'] - 3;

const inMap = configBot.tags.mapPortal ? true : false;
if ((inMap && (agentXPos - xPos > .001 || agentYPos - yPos > .001)) || 
    (!inMap && (agentXPos - xPos > 3.5 || agentYPos - yPos > 3.5))
) {
    await thisBot.moveBot({
        bot: thisBot,
        dimension: configBot.tags.gridPortal ?? 'home',
        position: {
            x: agentXPos,
            y: agentYPos
        }
    })
    return;
}

//check for arm extended
if (!links.armBot) {
    links.arm_tool.abCreateArm({
        originBot: thisBot,
        dimension: todoBot.tags.dimension,
        position: {
            x: xPos,
            y: yPos,
            z: 0
        }
    })
    tags.agentArm = `🧬${JSON.stringify({ dimension: todoBot.tags.dimension, position: { x: xPos, y: yPos } })}`;
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