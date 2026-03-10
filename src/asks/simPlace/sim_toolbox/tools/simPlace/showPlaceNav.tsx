if (configBot.tags.gridPortal != tags.chosenDimension) {
    return;
}

shout("clearPlaceNavMenu");

if (configBot.tags.menuPortal != "action_menu") {
    configBot.tags.menuPortal = "action_menu";
}

const menuOptions = {
    action_menu: true,
    clearPlaceNavMenu: `@destroy(thisBot);`
}

const doorsGroup = {
    groupSortOrder: 150,
    action_menuSortOrder: 150,
    menuItems: []
}

for (let i = 0; i < tags.doors.length; ++i) {
    const placeBot = getBot("simID", tags.doors[i]);
    if (!placeBot) {
        continue;
    }
    const tempDropdownItem = {
        ...menuOptions,
        place: getLink(placeBot),
        label: `travel to: ${placeBot?.tags.label}`,
        onClick: `@
            shout("activateStoryPlaceSkybox", links?.place?.tags.formAddress);
        `
    }
    doorsGroup.menuItems.push(tempDropdownItem);
}

if (tags.doors && tags.doors.length != 0) {
    ab.links.menu.abCreateMenuGroup(doorsGroup);
}