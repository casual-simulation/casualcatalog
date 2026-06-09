const todoBot = that;

configBot.masks.menuPortal = 'abPatchTodoAIModelMenu';

if (!configBot.tags.aiChatModels) {
    await ab.abRefreshAIModels();
}

const models = configBot.tags.aiChatModels ?? [];
const customAgents = await ab.links.utils.abCollectCustomAgentConfigs();

const menuTags = {
    abPatchTodoAIModelMenu: true,
    abPatchTodoMenuReset: `@destroy(thisBot)`,
    patchBot: getLink(todoBot),
};

// Group models by provider.
const providerMap = {};
for (const model of models) {
    if (!providerMap[model.provider]) {
        providerMap[model.provider] = [];
    }
    providerMap[model.provider].push({
        ...menuTags,
        label: `${model.name === todoBot.tags.aiModel && !todoBot.tags.agentName ? '✓ ' : ''}${model.name}`,
        formAddress: 'lightbulb',
        modelName: model.name,
        onClick: `@
            links.patchBot.tags.aiModel = tags.modelName;
            links.patchBot.tags.agentName = null;
            ab.links.todo.abPatchTodoMenuOpen(links.patchBot);
        `,
    });
}

// Group custom agents by their group.
for (const agent of customAgents) {
    if (!providerMap[agent.group]) {
        providerMap[agent.group] = [];
    }
    providerMap[agent.group].push({
        ...menuTags,
        label: `${agent.agentName === todoBot.tags.agentName ? '✓ ' : ''}${agent.agentName}`,
        formAddress: 'lightbulb',
        agentName: agent.agentName,
        onClick: `@
            links.patchBot.tags.agentName = tags.agentName;
            links.patchBot.tags.aiModel = null;
            ab.links.todo.abPatchTodoMenuOpen(links.patchBot);
        `,
    });
}

let sortOrder = 1;
for (const [provider, options] of Object.entries(providerMap)) {
    ab.links.menu.abCreateMenuDropdown({
        ...menuTags,
        label: provider,
        dropdownSortOrder: sortOrder++,
        dropdownOptions: options,
    });
}
