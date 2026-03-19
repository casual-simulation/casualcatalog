const data = JSON.parse(that.data);
if (data && data.prompt) {
    setTagMask(thisBot, "latestInquiry", data.prompt);
    setTagMask(thisBot, "latestInquiryID", that.id);
    
    //ab.links.ask.abCoreMenuAction(data.prompt);
    const abArtifactShard = {
        data: {
            prompt: data.prompt,
            eggParameters: {
                gridInformation: {
                    dimension: ab.links.remember.abGridFocus?.dimension ?? tags.dimension ?? 'home',
                    position: {
                        x: ab.links.remember.abGridFocus?.position?.x ?? 0,
                        y: ab.links.remember.abGridFocus?.position?.x ?? 0
                    }
                }
            }
        },
        dependencies: [
            {
                askID: 'toDoBot'
            }
        ]
    };
    await ab.links.artifact.abCreateArtifactPromiseBot({
        abArtifactName: 'toDoBot',
        abArtifactInstanceID: uuid(),
        abArtifactShard,
    });

    await os.sleep(1000);

    const abBot = ab.links.manifestation.links.abBot;
    //pull in agent bot
    await ab.links.search.onLookupAskID({
        askID: 'agent_bot_tool',
        eggParameters: {
            gridInformation: {
                dimension: configBot.tags.gridPortal ?? 'home',
                position: {
                    x: abBot.tags[(configBot.tags.gridPortal ?? 'home') + 'X'] ?? 1,
                    y: abBot.tags[(configBot.tags.gridPortal ?? 'home') + 'Y'] ?? 0
                }
            },
            aiModel: abPersonality.tags.abPreferredAIModel,
        }
    })
    let agentBot = getBot("agent_bot_tool", true);

    if (!agentBot) {
        os.toast("could not create ai agent");
        return;
    }

    //complete the todo
    const toDoBot = getBot(byTag("toDo", true), byTag("prompt", data.prompt));
    const prompt = toDoBot.tags.prompt;
    if (!prompt) {
        os.toast("failed to execute request")
        return;
    }

    const xPos = toDoBot.tags[toDoBot.tags.dimension + 'X'];
    const yPos = toDoBot.tags[toDoBot.tags.dimension + 'Y'];

    const agentXPos = (agentBot.tags[toDoBot.tags.dimension + 'X'] && agentBot.tags[toDoBot.tags.dimension + 'X'] > toDoBot.tags[toDoBot.tags.dimension + 'X']) ? toDoBot.tags[toDoBot.tags.dimension + 'X'] + 3 : toDoBot.tags[toDoBot.tags.dimension + 'X'] - 3;
    const agentYPos = (agentBot.tags[toDoBot.tags.dimension + 'Y'] && agentBot.tags[toDoBot.tags.dimension + 'Y'] > toDoBot.tags[toDoBot.tags.dimension + 'Y']) ? toDoBot.tags[toDoBot.tags.dimension + 'Y'] + 3 : toDoBot.tags[toDoBot.tags.dimension + 'Y'] - 3;

    await thisBot.moveBot({
        bot: agentBot,
        dimension: configBot.tags.gridPortal ?? 'home',
        position: {
            x: agentXPos,
            y: agentYPos
        }
    })

    await os.sleep(250);

    links.arm_tool.abCreateArm({
        originBot: agentBot,
        dimension: toDoBot.tags.dimension,
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

    agentBot.masks.targetBot = getLink(toDoBot);
    agentBot.masks.promptType = 'grid';
    agentBot.agentOnRequest({
        inquiry: prompt,
        data: requestData, 
        model: agentBot.tags.aiModel
    });

    toDoBot.tags[toDoBot.tags.dimension] = false;
    // destroy(toDoBot);
    // destroy(agentBot);

    await os.sleep(1000);
}