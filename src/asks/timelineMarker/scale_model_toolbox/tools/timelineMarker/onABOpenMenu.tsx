if (that.menuType != 'abBotMenu' || ab.links.remember.links.abBotFocus != thisBot) {
    return;
}

const menuOptions = {
    abMenuRefresh: `@destroy(thisBot);`,
    abMenu: true,
    marker: getLink(thisBot)
}

const markerMenuButton = {
    ...menuOptions,
    formAddress: 'lock_open',
    label: 'unlock',
    onClick: `@
        links.marker.tags.markerLocked = false;
        shout('abMenuRefresh');

        links.marker.onClick();
    `
}

if (tags.markerLocked) {
    ab.links.menu.abCreateMenuButton(markerMenuButton); 
}