const aiChatModels = configBot.tags.aiChatModels ?? (await ai.listChatModels());

if (!aiChatModels || aiChatModels.length === 0) {
    return [];
}

const options = aiChatModels.map(model => ({
    value: model.name,
    label: `${model.provider} / ${model.name}`,
}));

const properties: ABConfiguratorProperty[] = [
    {
        key: 'aiModel',
        type: 'select',
        label: 'AI Model',
        description: 'The AI model the agent will use.',
        options,
    }
];

return properties;