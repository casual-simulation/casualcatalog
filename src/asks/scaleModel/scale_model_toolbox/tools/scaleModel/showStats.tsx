//shout("clearScaleModelMenu");
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
    let name = tags.modelAttributes[item].name;

    if (tags[name] || tags[name] == 0) {
        val = tags[name];
    }
    const tempDropdownItem = {
        ...menuOptions,
        label: `${name}: ${val}`,
        stat: name
    }
    seeAttributesButton.dropdownOptions.push(tempDropdownItem);
}

for (const item in tags.modelStates) {
    let val = tags.modelStates[item].start;
    let name = tags.modelStates[item].name;
    if (tags[name]) {
        val = tags[name];
    }
    const tempDropdownItem = {
        ...menuOptions,
        state: name,
        label: `${name}: ${val}`
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