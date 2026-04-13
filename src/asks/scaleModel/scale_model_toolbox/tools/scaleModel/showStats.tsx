shout("clearScaleModelMenu");
await os.sleep(0);

const menuOptions = {
    scaleModel_menu: true,
    clearScaleModelMenu: `@destroy(thisBot);`,
    abMenuRefresh: `@destroy(thisBot);`
}

configBot.tags.menuPortal = "scaleModel_menu"

const seeAttributesButton = {
    ...menuOptions,
    label: tags.label + ' stats',
    defaultOpen: true,
    ignoreOpenDropdownRules: true,
    dropdownSortOrder: 100,
    scaleModel_menuSortOrder: 100
}

seeAttributesButton.dropdownOptions = [];
for (const item in tags.modelAttributes) {
    let val = tags.modelAttributes[item].start;
    if (tags[item]) {
        val = tags[item];
    }
    const tempDropdownItem = {
        ...menuOptions,
        label: `${item}: ${val}`
    }
    seeAttributesButton.dropdownOptions.push(tempDropdownItem);
}

for (const item in tags.modelStates) {
    let val = tags.modelStates[item].start;
    if (tags[item]) {
        val = tags[item];
    }
    const tempDropdownItem = {
        ...menuOptions,
        label: `${item}: ${val}`
    }
    seeAttributesButton.dropdownOptions.push(tempDropdownItem);
}

if (tags.statsButton) {
    destroy(links?.statsButton);
}

if (tags.modelAttributes && Object.keys(tags.modelAttributes).length != 0) {
    const stats = await ab.links.menu.abCreateMenuDropdown(seeAttributesButton);
    tags.statsButton = getLink(stats);
}