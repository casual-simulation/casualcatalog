const toDoBots = getBots("toDo", true);
let agentBot = getBot("agent_bot_tool", true);
if (!agentBot) {
    //create agent bot
    await ab.links.search.onLookupAskID({
        askID: 'agent_bot_tool',
        eggParameters: {
            gridInformation: {
                dimension: configBot.tags.gridPortal ?? 'home',
                position: {
                    x: 1,
                    y: 0
                }
            },
            aiModel: abPersonality.tags.abPreferredAIModel,
        }
    })
    agentBot = getBot("agent_bot_tool", true);
}

if (!agentBot) {
    os.toast("could not find or create ai agent");
    return;
}

setTagMask(thisBot, "latestInquiry", toDoBots[toDoBots.length - 1].tags.prompt);
setTagMask(thisBot, "latestInquiryID", that.id);

for (let i = 0; i < toDoBots.length; ++i) {
    const prompt = toDoBots[i].tags.prompt;
    if (!prompt) {
        continue;
    }

    const xPos = toDoBots[i].tags[toDoBots[i].tags.dimension + 'X'];
    const yPos = toDoBots[i].tags[toDoBots[i].tags.dimension + 'Y'];

    const agentXPos = (agentBot.tags[toDoBots[i].tags.dimension + 'X'] && agentBot.tags[toDoBots[i].tags.dimension + 'X'] > toDoBots[i].tags[toDoBots[i].tags.dimension + 'X']) ? toDoBots[i].tags[toDoBots[i].tags.dimension + 'X'] + 3 : toDoBots[i].tags[toDoBots[i].tags.dimension + 'X'] - 3;
    const agentYPos = (agentBot.tags[toDoBots[i].tags.dimension + 'Y'] && agentBot.tags[toDoBots[i].tags.dimension + 'Y'] > toDoBots[i].tags[toDoBots[i].tags.dimension + 'Y']) ? toDoBots[i].tags[toDoBots[i].tags.dimension + 'Y'] + 3 : toDoBots[i].tags[toDoBots[i].tags.dimension + 'Y'] - 3;

    await thisBot.moveBot({
        bot: agentBot,
        dimension: toDoBots[i].tags.dimension ?? 'home',
        position: {
            x: agentXPos,
            y: agentYPos
        }
    })

    await os.sleep(500);

    links.arm_tool.abCreateArm({
        originBot: agentBot,
        dimension: toDoBots[i].tags.dimension,
        position: {
            x: xPos,
            y: yPos,
            z: 0
        }
    })
    await os.sleep(1000);

    const requestData = {};
    if (agentBot.links.armBot) {
        const armBot = agentBot.links.armBot;
        const armDimension = armBot.tags.dimension;

        requestData.armDimension = armDimension;
        requestData.armDimensionX = armBot.tags[armDimension + "X"];
        requestData.armDimensionY = armBot.tags[armDimension + "Y"];
    }

    agentBot.masks.targetBot = getLink(toDoBots[i]);
    agentBot.masks.promptType = 'grid';
    agentBot.agentOnRequest({
        inquiry: prompt,
        data: requestData, 
        model: agentBot.tags.aiModel
    });

    await os.sleep(1000);
}