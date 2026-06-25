if (that) {
    if (that.modality == 'mouse' && that.buttonId == 'right') {
        return;
    }
}

shout('abMenuRefresh');
shout("clearSimWizardMenu");

configBot.tags.menuPortal = 'simWizard_menu';

const menuOptions = {
    simWizard_menu: true,
    clearSimWizardMenu: `@destroy(thisBot);`,
    abMenuRefresh: "@ destroy(thisBot);",
    wizard: getLink(thisBot)
}

const configButton = {
    ...menuOptions,
    label: 'configure',
    simWizard_menuSortOrder: 1,
    formAddress: 'edit',
    onClick: `@
        ab.links.configurator.abOpenConfigurator({ abConfiguratorGroup: links.wizard.tags.abConfiguratorGroup});
    `
}

const saveSimButton = {
    ...menuOptions,
    label: 'save sim',
    simWizard_menuSortOrder: 2,
    formAddress: 'save',
    onClick: `@
        links.wizard.saveSim();
        shout("clearSimWizardMenu");
    `
}

const testSimButton = {
    ...menuOptions,
    label: 'test sim',
    simWizard_menuSortOrder: 2,
    formAddress: 'science',
    onClick: `@
        links.wizard.testSim();
        shout("clearSimWizardMenu");
    `
}

ab.links.menu.abCreateMenuButton(configButton);
ab.links.menu.abCreateMenuButton(saveSimButton);
ab.links.menu.abCreateMenuButton(testSimButton);