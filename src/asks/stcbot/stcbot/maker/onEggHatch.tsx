if (that.eggParameters) {
    const dimension = that.eggParameters.gridInformation?.dimension ?? 'home';
    const dimensionX = that.eggParameters.gridInformation?.position?.x ?? 0;
    const dimensionY = that.eggParameters.gridInformation?.position?.y ?? 0;

    const aiChatModels = configBot.tags.aiChatModels ?? (await ai.listChatModels());
    
    // Check that the desired model is available.
    let aiModel = tags.desiredAIModel;
    const modelAvailable = aiChatModels.some(e => e.name === aiModel);

    if (!modelAvailable) {
        // If the desired model is no longer available, fallback to the ab personality's current ai model.
        aiModel = ab.links.personality.tags.abPreferredAIModel;
    }

    await ab.links.search.onLookupAskID({
        askID: 'agent_bot_tool',
        eggParameters: {
            gridInformation: {
                dimension: dimension,
                position: {
                    x: dimensionX,
                    y: dimensionY
                }
            },
            aiModel,
            customAgentConfig: {
                meshPath: "/asks/agent-assets/stc_map_icon.glb",
                armMeshPath: "/ab/meshes/webslinger.glb",
                armColor: "#FF375E",
                chatBarColor: "#FF375E",
                labelColor: "black",
                scale: 2.5,
                formOpacity: null,
                showName: false,
                agentName: "stcbot",
                draggable: false
            }
        }
    })
}

if (!configBot.tags.stcbotDevMode) {
    destroy(thisBot);
}