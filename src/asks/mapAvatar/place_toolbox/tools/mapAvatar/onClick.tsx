if (tags.remoteID != getID(configBot)) {
    return;
}

shout('abMenuRefresh');
shout("clearMapAvatarMenu");

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
    label: tags.usingGPS ? 'disable' : 'enable' + ' gps tracking',
    formAddress: tags.usingGPS ? 'near_me_disabled' : 'near_me',
    onClick: `@
        const journal = getBot("artifactJournal", true);
        journal.toggleLocationPull(!journal.continueLocationPull);

        thisBot.onClick();
    `,
}

ab.links.menu.abCreateMenuButton(leaveGPSButton);