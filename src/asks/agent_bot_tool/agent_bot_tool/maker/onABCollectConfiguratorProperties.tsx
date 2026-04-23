const groupMap: Record<string, ABConfiguratorSelectOptionGroup> = {};

const aiChatModels = configBot.tags.aiChatModels ?? (await ai.listChatModels());
if (aiChatModels && aiChatModels.length > 0) {
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
}

// Collect custom agent configs from bots.
const collectResults = await Promise.allSettled(shout('onABCollectCustomAgentConfigs'));

const customAgents: ABDynamicAgent[] = [];
for (const result of collectResults) {
    if (result.status === 'fulfilled' && result.value) {
        const agents = Array.isArray(result.value) ? result.value : [result.value];
        customAgents.push(...agents);
    }
}

for (const agent of customAgents) {
    if (!groupMap[agent.group]) {
        groupMap[agent.group] = {
            group: agent.group,
            label: agent.group,
            options: [],
        };
    }
    groupMap[agent.group].options.push({ value: agent.agentName, label: agent.agentName });
}

configBot.masks.customAgents = customAgents;

const SORT_ALPHABETICAL = true;

const options = Object.values(groupMap)
    .sort((a, b) => SORT_ALPHABETICAL ? a.label.localeCompare(b.label) : 0)
    .map(group => ({
        ...group,
        options: SORT_ALPHABETICAL
            ? group.options.slice().sort((a, b) => a.label.localeCompare(b.label))
            : group.options,
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