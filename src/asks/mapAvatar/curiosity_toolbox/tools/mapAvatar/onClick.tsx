//if this isnt the users own avatar, dont respond
if (tags.remoteID != getID(configBot)) {
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

configBot.tags.menuPortal = 'mapAvatar_menu';

const menuOptions = {
    mapAvatar_menu: true,
    clearMapAvatarMenu: `@destroy(thisBot);`,
    abMenuRefresh: "@ destroy(thisBot);",
    avatar: getLink(thisBot)
}

const leaveGPSButton = {
    ...menuOptions,
    label: (tags.continueLocationPull ? 'disable' : 'enable') + ' gps tracking',
    mapAvatar_menuSortOrder: -1,
    formAddress: tags.continueLocationPull ? 'near_me_disabled' : 'near_me',
    onClick: `@
        links.avatar.toggleLocationPull(!links.avatar.tags.continueLocationPull);

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

if (!tags.continueLocationPull) {
    thisBot.showPlaceNavMenu();
}
