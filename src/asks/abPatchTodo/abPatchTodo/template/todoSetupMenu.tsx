shout('patchTodoMenuReset');

configBot.masks.menuPortal = 'patchTodoMenu';

const menuOptions = {
    patchTodoMenu: true,
    patchTodoMenuReset: `@destroy(thisBot)`,
    patchBot: getLink(thisBot),
}

const promptButton = {
    ...menuOptions,
    label: 'prompt',
    formAddress: 'edit',
    onSubmit: `@
        links.patchBot.setPrompt(that.text);
    `,
    onCreate: `@
        masks.menuItemText = links.patchBot.tags.prompt;
    `
}

const modelsButton = {
    ...menuOptions,
    label: tags.aiModel ? `model: ${tags.aiModel}` : 'choose a model',
    toDo_menuSortOrder: 1,
    dropdownSortOrder: 1,
    dropdownOptions: []
}

const aiChatModels = configBot.tags.aiChatModels ?? [];

if (aiChatModels.length > 0) {
    for (let i = 0; i < aiChatModels.length; ++i) {
        const option = {
            label: aiChatModels[i].name,
            aiProvider: aiChatModels[i].provider,
            aiModel: aiChatModels[i].name,
            toDoBot: await getLink(thisBot),
            onClick: `@
                links.toDoBot.tags.aiModel = tags.aiModel;
                links.toDoBot.onClick();
            `,
        }

        modelsButton.dropdownOptions.push(option);
    }

    ab.links.menu.abCreateMenuDropdown(modelsButton);
}

ab.links.menu.abCreateMenuInput(promptButton);