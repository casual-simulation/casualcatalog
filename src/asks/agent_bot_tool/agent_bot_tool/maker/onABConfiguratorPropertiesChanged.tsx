const { propertyValues } = that;

if ('aiModel' in propertyValues) {
    const modelName = propertyValues.aiModel.value;
    const aiChatModels = configBot.tags.aiChatModels ?? (await ai.listChatModels());
    const match = aiChatModels?.find(m => m.name === modelName);

    if (!match) {
        console.error(`[${tags.system}.${tagName}] could not find ai model: ${modelName}`);
        return;
    }

    const dimension = tags.pendingDimension;
    masks.pendingDimension = null;

    thisBot.createAIAgent({
        dimension,
        aiModel: match.name,
        aiProvider: match.provider,
    });
}