if (that.menuType != 'abBotMenu' || ab.links.remember.links.abBotFocus != thisBot) {
    return;
}

const menuOptions = {
    abMenuRefresh: `@destroy(thisBot);`,
    abMenu: true,
    camera: getLink(thisBot)
}

const reloadDataButton = {
    ...menuOptions,
    label: 'update RoT',
    formAddress: 'autorenew',
    abMenuSortOrder: -1,
    onClick: `@
        links.camera.getDataFromStrapi();
        shout("abMenuRefresh");
    `
}

ab.links.menu.abCreateMenuButton(reloadDataButton);

return;