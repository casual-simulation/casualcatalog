if (that.menuType != 'abBotMenu' || ab.links.remember.links.abBotFocus != thisBot) {
    return;
}

const menuOptions = {
    abMenuRefresh: `@destroy(thisBot);`,
    abMenu: true,
    filter: getLink(thisBot)
}

const actionMenuButton = {
    ...menuOptions,
    formAddress: 'menu',
    label: 'show action menu',
    abMenuSortOrder: -1,
    onClick: `@
        links.filter.showActionMenu();
        shout('abMenuRefresh');
    `
}

//ab.links.menu.abCreateMenuButton(actionMenuButton);

return;