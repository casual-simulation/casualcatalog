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
    abMenuSortOrder: -1,
    dropdownSortOrder: -1,
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

ab.links.menu.abCreateMenuDropdown(switchProcessingButton);