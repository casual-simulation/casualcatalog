const todoBots = getBots("toDo", true);
const plans = [];

for (let i = 0 ; i < todoBots.length; ++i) {
//     if (todoBots[i].tags.prevTodoBot) {
//         continue;
//     } else {
//         plans.push([todoBots[i].id]);
//     }
// }

// for (let j = 0; j < plans.length; ++j) {
    
// }
    const abBot = ab.links.manifestation.links.abBot;
    let aiModel = todoBots[i].tags.aiModel ?? abPersonality.tags.abPreferredAIModel;
    //spawn agent
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
            aiModel: aiModel,
        }
    })
    let agentBot = getBot("agent_bot_tool", true);

    if (!agentBot) {
        os.toast("could not create ai agent");
        return;
    }

    //assign task
    agentBot.assignTask(todoBots[i].id)


}

thisBot.onStartAgentCycle();