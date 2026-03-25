if (tags.remoteID != getID(configBot)) {
    return;
}

if (that.menuType != 'abBotMenu' || ab.links.remember.links.abBotFocus != thisBot) {
    return;
}

const menuOptions = {
    abMenuRefresh: `@destroy(thisBot);`,
    abMenu: true,
    avatar: getLink(thisBot)
}

const leaveGPSButton = {
    ...menuOptions,
    label: 'disable gps tracking',
    formAddress: 'near_me_disabled',
    onClick: `@
        const journal = getBot("artifactJournal", true);
        journal.toggleLocationPull(false);

        shout("abMenuRefresh");
    `,
    abMenuSortOrder: -1
}

ab.links.menu.abCreateMenuButton(leaveGPSButton);