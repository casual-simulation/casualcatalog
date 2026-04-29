shout('abMenuRefresh');
shout("clearScaleModelMenu");

if (that) {
    if (that.modality == 'mouse' && that.buttonId == 'right') {
        return;
    }
}

configBot.masks.menuPortal = null;
configBot.tags.menuPortal = 'scaleModel_menu';

const menuOptions = {
    scaleModel_menu: true,
    clearScaleModelMenu: `@destroy(thisBot);`,
    abMenuRefresh: "@ destroy(thisBot);",
    model: getLink(thisBot)
}

//EDIT
const editButton = {
    ...menuOptions,
    label: 'edit',
    scaleModel_menuSortOrder: 0,
    formAddress: 'edit',
    onClick: `@
        ab.links.configurator.abOpenConfigurator({ abConfiguratorGroup: links.model.tags.abConfiguratorGroup});
    `
}

ab.links.menu.abCreateMenuButton(editButton);
thisBot.showStats();