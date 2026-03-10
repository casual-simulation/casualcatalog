const actionMenuOptions = {
    action_menu: true,
    clearActionMenu: `@destroy(thisBot);`,
    clearRoleStats: `@destroy(thisBot);`
}

const seeAttributesButton = {
    ...actionMenuOptions,
    label: 'player stats',
    defaultOpen: true,
    ignoreOpenDropdownRules: true,
    dropdownSortOrder: 1000,
    action_menuSortOrder: 1000
}

const roleBot = getBot("simID", tags.chosenRole);

seeAttributesButton.dropdownOptions = [];
for (const item in roleBot?.tags.simAttributes) {
    const tempDropdownItem = {
        ...actionMenuOptions,
        label: `${item}: ${roleBot?.tags.simAttributes[item]}`
    }
    seeAttributesButton.dropdownOptions.push(tempDropdownItem);
}

const statsBots = getBots(byTag("label", "player stats"), byTag("action_menu", true));
destroy(statsBots);

if (roleBot?.tags.simAttributes && Object.keys(roleBot?.tags.simAttributes).length != 0) {
    return seeAttributesButton;
} else {
    return null;
}