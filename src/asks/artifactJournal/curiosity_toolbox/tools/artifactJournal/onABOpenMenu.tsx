if (that.menuType != 'abBotMenu' || ab.links.remember.links.abBotFocus != thisBot) {
    return;
}

const menuOptions = {
    abMenuRefresh: `@destroy(thisBot);`,
    abMenu: true,
    journal: getLink(thisBot)
}

const reloadDataButton = {
    ...menuOptions,
    label: 'update RoT',
    formAddress: 'autorenew',
    abMenuSortOrder: -2,
    onClick: `@
        links.journal.getDataFromStrapi();
        shout("abMenuRefresh");
    `
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
            links.avatar.equipBot(links.journal.tags.equipmentId);
            shout("abMenuRefresh");
        `
    }
    ab.links.menu.abCreateMenuButton(equipToButton);
}

ab.links.menu.abCreateMenuButton(reloadDataButton);

return;