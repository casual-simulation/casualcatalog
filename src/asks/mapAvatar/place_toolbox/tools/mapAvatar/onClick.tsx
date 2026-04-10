if (tags.remoteID != getID(configBot)) {
    return;
}

shout('abMenuRefresh');
shout("clearMapAvatarMenu");

const journal = getBot("artifactJournal", true);

if (journal.tags.currentRegisteredApp) {
    os.unregisterApp(journal.tags.currentRegisteredApp);
    journal.tags.currentRegisteredApp = null;
} 

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
    label: (journal.tags.continueLocationPull ? 'disable' : 'enable') + ' gps tracking',
    formAddress: journal.tags.continueLocationPull ? 'near_me_disabled' : 'near_me',
    onClick: `@
        const journal = getBot("artifactJournal", true);
        journal.toggleLocationPull(!journal.tags.continueLocationPull);

        shout("clearMapAvatarMenu");
    `,
}

ab.links.menu.abCreateMenuButton(leaveGPSButton);

if (!journal.tags.continueLocationPull) {
    thisBot.showPlaceNavMenu();
}
