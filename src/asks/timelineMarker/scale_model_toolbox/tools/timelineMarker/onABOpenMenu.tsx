if (that.menuType != 'abBotMenu' || ab.links.remember.links.abBotFocus != thisBot) {
    return;
}

const menuOptions = {
    abMenuRefresh: `@destroy(thisBot);`,
    abMenu: true,
    marker: getLink(thisBot)
}

//EDIT
const editButton = {
    ...menuOptions,
    label: 'edit',
    abMenuSortOrder: 0,
    formAddress: 'edit',
    onClick: `@
        ab.links.configurator.abOpenConfigurator({ abConfiguratorGroup: links.marker.tags.abConfiguratorGroup});
    `
}

ab.links.menu.abCreateMenuButton(editButton); 