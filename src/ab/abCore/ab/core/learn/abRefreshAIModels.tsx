if (authBot) {
    const models = await ai.listChatModels();
    configBot.tags.aiChatModels = models;
} else {
    configBot.tags.aiChatModels = null;
}