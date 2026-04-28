const { propertyValues } = that;

if ('aiModel' in propertyValues) {
    const modelName = propertyValues.aiModel.value;
    const aiChatModels = configBot.tags.aiChatModels ?? (await ai.listChatModels());
    const match = aiChatModels?.find(m => m.name === modelName);

    const dimension = tags.pendingDimension;
    masks.pendingDimension = null;

    if (match) {
        thisBot.createAIAgent({ dimension, aiModel: match.name, aiProvider: match.provider });
    } else {
        const customAgents: ABDynamicAgent[] = configBot.masks.customAgents ?? [];
        const customAgent = customAgents.find(a => a.agentName === modelName);

        if (!customAgent) {
            console.error(`[${tags.system}.${tagName}] could not find ai model or custom agent: ${modelName}`);
            return;
        }

        const { aiModel, aiProvider, ...customAgentConfig } = customAgent;
        thisBot.createAIAgent({ dimension, aiModel, aiProvider, customAgentConfig });
    }
}