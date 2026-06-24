if (that) {
    if (that.modality == 'mouse' && that.buttonId == 'right') {
        return;
    }
}

shout('abMenuRefresh');
shout("clearSimEditorMenu");

configBot.tags.menuPortal = 'simEditor_menu';

const menuOptions = {
    simEditor_menu: true,
    clearSimEditorMenu: `@destroy(thisBot);`,
    abMenuRefresh: "@ destroy(thisBot);",
    editor: getLink(thisBot)
}

const configButton = {
    ...menuOptions,
    label: 'configure',
    simEditor_menuSortOrder: 1,
    formAddress: 'edit',
    onClick: `@
        ab.links.configurator.abOpenConfigurator({ abConfiguratorGroup: links.editor.tags.abConfiguratorGroup});
    `
}

const createPageButton = {
    ...menuOptions,
    label: 'create page',
    simEditor_menuSortOrder: 2,
    formAddress: 'edit',
    onClick: `@
        links.editor.generatePage();
    `
}

ab.links.menu.abCreateMenuButton(configButton);
ab.links.menu.abCreateMenuButton(createPageButton);