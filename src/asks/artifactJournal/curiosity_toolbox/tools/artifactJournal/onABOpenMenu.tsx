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

const playerButton = {
    ...menuOptions,
    label: 'spawn player',
    formAddress: 'add',
    abMenuSortOrder: -1,
    onClick: `@
        const avatarBot = getBot(byTag("mapAvatar", true), byTag("remoteID", configBot.tags.id));
        if (avatarBot) {
            destroy(avatarBot);
        }

        links.journal.spawnPlayer();
    `
}

ab.links.menu.abCreateMenuButton(reloadDataButton);
ab.links.menu.abCreateMenuButton(playerButton);

return;