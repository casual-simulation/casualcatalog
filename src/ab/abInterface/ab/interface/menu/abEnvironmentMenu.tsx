shout("abMenuRefresh");

configBot.masks.menuPortal = "abMenu";

const abMenuItem = {
    abMenu: true,
    abMenuRefresh: "@destroy(thisBot);",
    manifestation: tags.manifestation,
    remember: tags.remember,
    personality: tags.personality,
    learn: tags.learn,
};

const abEnvironmentOptions = thisBot.abGetEnvironmentOptions(); 

for (let i = 0; i < abEnvironmentOptions.length; i++) { 
    const option = abEnvironmentOptions[i];

    assert(typeof option.abEnvironmentMenuSortOrder === 'number', `[${tags.system}.${tagName}}] abEnvironmentMenuSortOrder must be a number.`);

    abMenuItem.abMenuSortOrder = option.abEnvironmentMenuSortOrder;

    const optionMod = {...abMenuItem, ...option};

    if (option.menuItemType === 'button' || !option.menuItemType) {
        thisBot.abCreateMenuButton(optionMod);
    } else if (option.menuItemType === 'dropdown') {
        optionMod.dropdownSortOrder = option.abEnvironmentMenuSortOrder;

        // Make sure each dropdown options gets abMenuItem defaults.
        if (option.dropdownOptions && option.dropdownOptions.length > 0) {
            for (let k = 0; k < option.dropdownOptions.length; k++) {
                option.dropdownOptions[k] = { ...abMenuItem, ...option.dropdownOptions[k] };
            }
        }

        thisBot.abCreateMenuDropdown(optionMod);
    } else if (option.menuItemType === 'group') {
        thisBot.abCreateMenuGroup(optionMod);
    } else if (option.menuItemType === 'input') {
        thisBot.abCreateMenuInput(optionMod);
    } else if (option.menuItemType === 'text') {
        thisBot.abCreateMenuText(optionMod);
    } else if (option.menuItemType === 'tool') {
        thisBot.abCreateMenuTool(optionMod);
    } else if (option.menuItemType === 'wizard') {
        thisBot.abCreateMenuWizard(optionMod);
    } else {
        console.error(`[${tags.system}.${tagName}] menuItemType ${option.menuItemType} is not implemented.`);
        continue;
    }
}

// thisBot.abCreateMenuDropdown(abPersonalityConfigButton);

thisBot.masks.onGridClick = `@
    shout('abMenuRefresh');
    links.manifestation.abClick({ reset: true });
`;
thisBot.masks.onKeyDown = `@
    if (that.keys.includes('Escape')) {
        shout('abMenuRefresh');
        links.manifestation.abClick({ reset: true });
    }
`;

shout('onABEnvironmentMenu', { menuPortal: configBot.tags.menuPortal} )