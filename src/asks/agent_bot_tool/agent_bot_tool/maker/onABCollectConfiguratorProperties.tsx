const aiChatModels = configBot.tags.aiChatModels ?? (await ai.listChatModels());

if (!aiChatModels || aiChatModels.length === 0) {
    return [];
}

const groupMap: Record<string, ABConfiguratorSelectOptionGroup> = {};
for (const model of aiChatModels) {
    if (!groupMap[model.provider]) {
        groupMap[model.provider] = {
            group: model.provider,
            label: model.provider,
            options: [],
        };
    }
    groupMap[model.provider].options.push({ value: model.name, label: model.name });
}

const options = Object.values(groupMap);

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