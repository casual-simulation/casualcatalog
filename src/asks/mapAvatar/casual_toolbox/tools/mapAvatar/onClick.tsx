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

if (tags.selected) {
    changeState(thisBot, false, "selected");
    return;
} else {
    changeState(thisBot, true, "selected");
}

configBot.tags.menuPortal = 'mapAvatar_menu';

const menuOptions = {
    mapAvatar_menu: true,
    clearMapAvatarMenu: `@destroy(thisBot);`,
    abMenuRefresh: "@ destroy(thisBot);",
    avatar: getLink(thisBot)
}

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

const camBot = getBot("curiosityCamera", true);
if (camBot) {
    const cameraButton = {
        ...menuOptions,
        label: 'curiosity camera',
        mapAvatar_menuSortOrder: -2,
        formAddress: 'photo_camera',
        onClick: `@
            const camBot = getBot("curiosityCamera", true);
            camBot.onClick();

            shout("clearMapAvatarMenu");
        `,
    }

    ab.links.menu.abCreateMenuButton(cameraButton);
}

const journal = getBot("artifactJournal", true);
if (journal) {
    const viewCollectionsButton = {
        ...menuOptions,
        label: 'artifact journal',
        formAddress: 'menu_book',
        mapAvatar_menuSortOrder: -31,
        onClick: `@
            const journal = getBot("artifactJournal", true);
            journal.onClick();

            shout("clearMapAvatarMenu");
        `,
    }

    ab.links.menu.abCreateMenuButton(viewCollectionsButton);
}

ab.links.menu.abCreateMenuButton(leaveGPSButton);

thisBot.showPlaceNavMenu();