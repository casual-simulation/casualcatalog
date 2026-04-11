configBot.masks.menuPortal = 'abPatchTodoAIModelMenu';

if (!configBot.tags.aiChatModels) {
    await ab.abRefreshAIModels();
}

const models = configBot.tags.aiChatModels ?? [];

const menuTags = {
    abPatchTodoAIModelMenu: true,
    abPatchTodoMenuReset: `@destroy(thisBot)`,
    patchBot: getLink(thisBot),
};

// Group models by provider.
const providerMap = {};
for (const model of models) {
    if (!providerMap[model.provider]) {
        providerMap[model.provider] = [];
    }
    providerMap[model.provider].push({
        ...menuTags,
        label: `${model.name === tags.aiModel ? '✓ ' : ''}${model.name}`,
        formAddress: 'lightbulb',
        modelName: model.name,
        onClick: `@
            links.patchBot.tags.aiModel = tags.modelName;
            whisper(links.patchBot, 'abPatchTodoMenuOpen');
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
