shout('abMenuRefresh');

configBot.masks.menuPortal = null;
configBot.tags.menuPortal = 'place_portal_confirm_menu';

const BASE_MENU_TAGS = {
    place_portal_confirm_menu: true,
    clearPlacePortalMenu: `@destroy(thisBot);`,
    abMenuRefresh: "@ destroy(thisBot);",
    place: getLink(thisBot)
}

const confirmGroup = {
    ...BASE_MENU_TAGS,
    groupSortOrder: 1,
    menuItems: []
}

//CONFIRM TEXT
const confirmText = {
    ...BASE_MENU_TAGS,
    label: `go to ${tags.label}?`,
    menuItemType: 'text',
    color: abPersonality.tags.abBaseMenuColor
}

//CONFIRM YES
const confirmYes = {
    ...BASE_MENU_TAGS,
    label: `yes`,
    formAddress: 'check',
    onClick: `@
        //circle wipe
        os.goToURL(links.place.tags.instURL); 
    `
}

//CONFIRM NO
const confirmNo = {
    ...BASE_MENU_TAGS,
    label: `no`,
    formAddress: 'cancel',
    onClick: `@
        shout("clearPlacePortalMenu");
    `
}

confirmGroup.menuItems.push(confirmText);
confirmGroup.menuItems.push(confirmYes);
confirmGroup.menuItems.push(confirmNo);

ab.links.menu.abCreateMenuGroup(confirmGroup);