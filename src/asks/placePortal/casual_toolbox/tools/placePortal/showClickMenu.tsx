if (that) {
    if (that.modality == 'mouse' && that.buttonId == 'right') {
        return;
    }
}

shout('abMenuRefresh');

configBot.masks.menuPortal = null;
configBot.tags.menuPortal = 'place_portal_menu';

const BASE_MENU_TAGS = {
    place_portal_menu: true,
    clearPlacePortalMenu: `@destroy(thisBot);`,
    abMenuRefresh: "@ destroy(thisBot);",
    place: getLink(thisBot)
}

//NEW 
const newButton = {
    ...BASE_MENU_TAGS,
    label: 'new',
    formAddress: 'add',
    place_portal_menuSortOrder: 1,
    onClick: `@
        links.place.showNewInstMenu();
    `
}

ab.links.menu.abCreateMenuButton(newButton);

//EXISTING
const existingButton = {
    ...BASE_MENU_TAGS,
    label: 'choose existing',
    formAddress: 'search',
    place_portal_menuSortOrder: 2,
    onClick: `@
        links.place.showInstSelectMenu();
    `
}

ab.links.menu.abCreateMenuButton(existingButton);