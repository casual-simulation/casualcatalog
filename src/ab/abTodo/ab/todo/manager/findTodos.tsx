console.warn(`[${tags.system}.${tagName}] deprecated.`);
return;

/*
const todoBots = getBots((b) => {
    return b.tags.abPatchTodo &&
           b.tags.abPatchTodoInstance
});
const plans = [];

for (let i = 0 ; i < todoBots.length; ++i) {
    const abBot = ab.links.manifestation.links.abBot;
    let aiModel = todoBots[i].tags.aiModel ?? abPersonality.tags.abPreferredAIModel;

    // Spawn agent
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

    // Assign task
    agentBot.assignTask(todoBots[i].id)
}

thisBot.onStartAgentCycle();
*/