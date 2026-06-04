shout('abMenuRefresh');

configBot.masks.menuPortal = null;
configBot.tags.menuPortal = 'place_portal_new_inst_menu';

const BASE_MENU_TAGS = {
    place_portal_new_inst_menu: true,
    clearPlacePortalMenu: `@destroy(thisBot);`,
    abMenuRefresh: "@ destroy(thisBot);",
    place: getLink(thisBot)
}

//NAME
const nameButton = {
    ...BASE_MENU_TAGS,
    label: 'name this place',
    onInputTyping: `@
        links.place.tags.instSetting = that.text;
    `,
    onSubmit: `@
        links.place.tags.instSetting = that.text;
        links.place.createURL();
        shout('clearPlacePortalMenu');
    `
}

ab.links.menu.abCreateMenuInput(nameButton);