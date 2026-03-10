shout("clearStudioWizardMenu");

configBot.tags.menuPortal = 'studioWizard_menu';

const menuOptions = {
    studioWizard_menu: true,
    abMenuRefresh: `@destroy(thisBot);`,
    clearStudioWizardMenu: `@destroy(thisBot);`,
    wizard: getLink(thisBot)
}

const studioGroup = {
    ...menuOptions,
    label: 'choose a studio',
    dropdownSortOrder: 1,
    dropdownOptions: []
}

let studioData = await os.listUserStudios();

if (studioData.success) {
    const studios = studioData.studios;
    for (let i = 0; i < studios.length; ++i) {
        const studioBot = getBot(byTag("studioStation", true), byTag("studioId", studios[i].studioId));
        if (!studioBot) {
            //add to menu
            studioGroup.dropdownOptions.push( {
                ...menuOptions,
                label: studios[i].displayName,
                studioData: studios[i],
                onClick: `@
                    links.wizard.addStudio(tags.studioData);
                    shout('clearStudioWizardMenu');
                `
            })
        }
    }

    const homeStudioBot = getBot(byTag("studioStation", true), byTag("studioId", authBot?.id));
        if (!homeStudioBot) {
            //add to menu
            studioGroup.dropdownOptions.push( {
                ...menuOptions,
                label: 'home studio',
                studioData: {
                    studioId: authBot?.id,
                    displayName: 'home studio'
                },
                onClick: `@
                    links.wizard.addStudio(tags.studioData);
                    shout('clearStudioWizardMenu');
                `
            })
        }
}

ab.links.menu.abCreateMenuDropdown(studioGroup);