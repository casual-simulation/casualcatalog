shout('clearEggWizardMenu');

configBot.masks.menuPortal = 'eggWizardMenu';

const newButton = {
    clearEggWizardMenu: `@destroy(thisBot);`,
    eggWizardMenu: true,
    label: "new egg",
    wizard: getLink(thisBot),
    formAddress: 'add',
    onClick: `@
        links.wizard.newEgg();
        shout('clearEggWizardMenu');
    `,
    eggWizardMenuSortOrder: 1
}

ab.links.menu.abCreateMenuButton(newButton);

const chooseExistingButton = {
    clearEggWizardMenu: `@destroy(thisBot);`,
    eggWizardMenu: true,
    label: "choose existing",
    wizard: getLink(thisBot),
    onClick: `@
        const response = await os.showInput(null, {
            title: 'egg name'
        });
        if (response) {
            links.wizard.loadEgg(response);
        }
        shout('clearEggWizardMenu');
    `,
    eggWizardMenuSortOrder: 2
}

ab.links.menu.abCreateMenuButton(chooseExistingButton);