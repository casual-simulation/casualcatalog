shout('abMenuRefresh');
shout("clearEquipmentMenu");

configBot.tags.menuPortal = 'mapAvatar_menu';
await os.sleep(0);

const menuOptions = {
    mapAvatar_menu: true,
    clearMapAvatarMenu: `@destroy(thisBot);`,
    clearEquipmentMenu: `@destroy(thisBot);`,
    abMenuRefresh: "@ destroy(thisBot);",
    avatar: getLink(thisBot)
}

const equipmentDropdown = {
    ...menuOptions,
    label: 'equipment',
    dropdownSortOrder: 20,
    dropdownOptions: [],
    mapAvatar_menuSortOrder: 20,
}

const equipment = getBots()

const leaveGPSButton = {
    ...menuOptions,
    label: (links.homeworld?.tags.usingGPS ? 'disable' : 'enable') + ' gps tracking',
    mapAvatar_menuSortOrder: -1,
    formAddress: links.homeworld?.tags.usingGPS ? 'near_me_disabled' : 'near_me',
    onClick: `@
        links.avatar.links.homeworld?.toggleGPS(!links.avatar.links.homeworld?.tags.usingGPS);
        if (!links.avatar.links.homeworld.tags.introPlayed && !links.avatar.links.homeworld?.tags.usingGPS == true) {
            links.avatar.links.homeworld.masks.introPlayed = true;
        }
        shout("clearMapAvatarMenu");
    `,
}


ab.links.menu.abCreateMenuButton(leaveGPSButton);