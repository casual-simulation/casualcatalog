if (that.menuType != 'abBotMenu' || ab.links.remember.links.abBotFocus != thisBot) {
    return;
}

const menuOptions = {
    abMenuRefresh: `@destroy(thisBot);`,
    abMenu: true,
    camera: getLink(thisBot)
}

const switchProcessingButton = {
    ...menuOptions,
    label: 'switch processing mode',
    abMenuSortOrder: -2,
    dropdownSortOrder: -2,
    dropdownOptions: [
        {
            ...menuOptions,
            label: 'Teachable Machine',
            onClick: `@
                links.camera.tags.processingMode = 'teachableMachine';
                shout("abMenuRefresh");
            `
        },
        {
            ...menuOptions,
            label: 'AI',
            onClick: `@
                links.camera.tags.processingMode = 'ai';
                shout("abMenuRefresh");
            `
        }
    ]
}

const pimIDButton = {
    ...menuOptions,
    label: 'change pimID',
    abMenuSortOrder: -3,
    onCreate: `@
        masks.menuItemText = links.camera.tags.pimID;
    `,
    onInputTyping: `@
        links.camera.tags.pimID = that.text;
    `,
    onSubmit: `@
        links.camera.tags.pimID = that.text;
        links.camera.getDataFromStrapi();
        shout("abMenuRefresh");
    `
}

ab.links.menu.abCreateMenuDropdown(switchProcessingButton);
ab.links.menu.abCreateMenuInput(pimIDButton);