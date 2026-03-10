shout("clearPropMenu");
await os.sleep(0);

const menuOptions = {
    action_menu: true,
    //clearActionMenu: `@destroy(thisBot);`,
    clearPropMenu: `@destroy(thisBot);`,
    abMenuRefresh: `@destroy(thisBot);`
}

configBot.tags.menuPortal = "action_menu"

const seeAttributesButton = {
    ...menuOptions,
    label: tags.label + ' stats',
    defaultOpen: true,
    ignoreOpenDropdownRules: true,
    dropdownSortOrder: 100,
    action_menuSortOrder: 100
}

seeAttributesButton.dropdownOptions = [];
for (const item in tags.simAttributes) {
    const tempDropdownItem = {
        ...menuOptions,
        label: `${item}: ${tags.simAttributes[item]}`
    }
    seeAttributesButton.dropdownOptions.push(tempDropdownItem);
}

if (tags.statsButton) {
    destroy(links?.statsButton);
}

if (tags.simAttributes && Object.keys(tags.simAttributes).length != 0) {
    const stats = await ab.links.menu.abCreateMenuDropdown(seeAttributesButton);
    tags.statsButton = getLink(stats);
}