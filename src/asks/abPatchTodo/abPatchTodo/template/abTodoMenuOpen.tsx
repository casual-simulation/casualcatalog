shout('abTodoMenuReset');

configBot.masks.menuPortal = 'abTodoMenu';

const menuOptions = {
    abTodoMenu: true,
    abTodoMenuReset: `@destroy(thisBot)`,
    patchBot: getLink(thisBot),
}

const promptButton = {
    ...menuOptions,
    label: 'prompt',
    formAddress: 'edit',
    onSubmit: `@
        links.patchBot.tags.prompt = that.text;
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
            todoBot: await getLink(thisBot),
            onClick: `@
                links.todoBot.tags.aiModel = tags.aiModel;
                links.todoBot.onClick();
            `,
        }

        modelsButton.dropdownOptions.push(option);
    }

    ab.links.menu.abCreateMenuDropdown(modelsButton);
}

ab.links.menu.abCreateMenuInput(promptButton);