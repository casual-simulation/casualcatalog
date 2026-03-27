let openMenu = that.eggParameters?.openMenu ?? true;

if (that.eggParameters) {
    const dimension = that.eggParameters.gridInformation?.dimension ?? 'home';
    const dimensionX = that.eggParameters.gridInformation?.position?.x ?? 0;
    const dimensionY = that.eggParameters.gridInformation?.position?.y ?? 0;

    tags[dimension] = true;
    tags[dimension + 'X'] = dimensionX;
    tags[dimension + 'Y'] = dimensionY;

    if (that.eggParameters.customAgentConfig) {
        tags.customAgentConfig = that.eggParameters.customAgentConfig;
    }

    if (that.eggParameters.aiModel) {
        // AI model has been provided with egg parameters, make it immediately.
        const aiChatModels = configBot.tags.aiChatModels ?? (await ai.listChatModels());
        const match = aiChatModels.find(e => e.name === that.eggParameters.aiModel);

        if (match) {
            const agentBot = thisBot.createAIAgent({
                dimension,
                aiModel: match.name,
                aiProvider: match.provider
            });
              

            openMenu = false;
        } else {
            console.error(`[${tags.system}.${tagName}] '${aiModel}' is not a supported ai model.`);
        }
    }
}

if (openMenu) {
    thisBot.onClick();
}