if (!tags.task || masks.taskInProgress) {
    return;
}

const toDoBot = getBot(byID(tags.task));

//check for closeness
const xPos = toDoBot.tags[toDoBot.tags.dimension + 'X'];
const yPos = toDoBot.tags[toDoBot.tags.dimension + 'Y'];

const agentXPos = (tags[toDoBot.tags.dimension + 'X'] && tags[toDoBot.tags.dimension + 'X'] > toDoBot.tags[toDoBot.tags.dimension + 'X']) ? toDoBot.tags[toDoBot.tags.dimension + 'X'] + 3 : toDoBot.tags[toDoBot.tags.dimension + 'X'] - 3;
const agentYPos = (tags[toDoBot.tags.dimension + 'Y'] && tags[toDoBot.tags.dimension + 'Y'] > toDoBot.tags[toDoBot.tags.dimension + 'Y']) ? toDoBot.tags[toDoBot.tags.dimension + 'Y'] + 3 : toDoBot.tags[toDoBot.tags.dimension + 'Y'] - 3;

const inMap = configBot.tags.mapPortal ? true : false;
if ((inMap && (agentXPos - xPos > .001 || agentYPos - yPos > .001)) || (!inMap && (agentXPos - xPos > 3.5 || agentYPos - yPos > 3.5))) {
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
        dimension: toDoBot.tags.dimension,
        position: {
            x: xPos,
            y: yPos,
            z: 0
        }
    })
    return;
}

//do task
const requestData = {};
if (thisBot.links.armBot) {
    const armBot = links.armBot;
    const armDimension = armBot.tags.dimension;

    requestData.armDimension = armDimension;
    requestData.armDimensionX = armBot.tags[armDimension + "X"];
    requestData.armDimensionY = armBot.tags[armDimension + "Y"];
}

masks.targetBot = getLink(toDoBot);
masks.promptType = 'grid';
thisBot.agentOnRequest({
    inquiry: toDoBot.tags.abPatchAskInput.inquiry,
    data: requestData, 
    model: tags.aiModel
});

masks.taskInProgress = true;