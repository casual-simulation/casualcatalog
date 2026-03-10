if (that) {
    if (that.modality == 'mouse' && that.buttonId == 'right') {
        return;
    }
}

shout('abMenuRefresh');
shout("clearToDoMenu");

configBot.tags.menuPortal = 'toDo_menu';

const menuOptions = {
    toDo_menu: true,
    clearToDoMenu: `@destroy(thisBot);`,
    abMenuRefresh: "@destroy(thisBot);",
    toDo: getLink(thisBot)
}

const promptButton = {
    ...menuOptions,
    label: 'edit prompt',
    toDo_menuSortOrder: 2,
    onSubmit: `@
        links.toDo.tags.prompt = that.text;
        shout("clearToDoMenu");
    `,
    onCreate: `@
        masks.menuItemText = links.toDo.tags.prompt ?? "";
    `
}

const modelsButton = {
    ...menuOptions,
    label: 'choose a model: ' + tags.aiModel,
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
