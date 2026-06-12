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

const avatarBot = getBot(byTag("mapAvatar", true), byTag("ownerID", authBot?.id));
if (avatarBot) {
    const equipToButton = {
        ...menuOptions,
        label: 'equip to avatar',
        avatar: getLink(avatarBot),
        formAddress: 'add',
        abMenuSortOrder: -3,
        onClick: `@
            links.camera.tags.abEquipmentFor = getID(links.avatar);
            shout("abMenuRefresh");
        `
    }
    ab.links.menu.abCreateMenuButton(equipToButton);
}

ab.links.menu.abCreateMenuDropdown(switchProcessingButton);