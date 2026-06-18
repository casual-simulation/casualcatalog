//if this isnt the users own avatar, dont respond
if (tags.ownerID !=  authBot?.id) {
    return;
}

shout('abMenuRefresh');
shout("clearMapAvatarMenu");

//handle right click
if (that) {
    if (that.modality == 'mouse' && that.buttonId == 'right') { 
        return;
    }
}

if (tags.abEquipmentBaseSelected) {
    return;
}

configBot.tags.menuPortal = 'mapAvatar_menu';
await os.sleep(0);

const menuOptions = {
    mapAvatar_menu: true,
    clearMapAvatarMenu: `@destroy(thisBot);`,
    abMenuRefresh: "@ destroy(thisBot);",
    avatar: getLink(thisBot)
}

const leaveGPSButton = {
    ...menuOptions,
    label: links.homeworld?.tags.usingGPS ? 'stop following location' : 'use my location',
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

if (configBot.tags.mapPortal && links.homeworld) {
    ab.links.menu.abCreateMenuButton(leaveGPSButton);
}

thisBot.showPlaceNavMenu();