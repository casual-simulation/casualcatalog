const menuOptions = {
    abMenuRefresh: `@destroy(thisBot);`,
    abMenu: true,
    instBot: getLink(thisBot)
}

//EDIT
const editButton = {
    ...menuOptions,
    label: 'edit',
    scaleModel_menuSortOrder: 0,
    formAddress: 'edit',
    onClick: `@
        ab.links.configurator.abOpenConfigurator({ abConfiguratorGroup: links.instBot.tags.abConfiguratorGroup});
    `
}

ab.links.menu.abCreateMenuButton(editButton);