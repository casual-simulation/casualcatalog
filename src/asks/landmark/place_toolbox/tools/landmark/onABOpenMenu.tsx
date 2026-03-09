if (that.menuType != 'abBotMenu' || ab.links.remember.links.abBotFocus != thisBot) {
    return;
}

const menuOptions = {
    abMenuRefresh: `@destroy(thisBot);`,
    abMenu: true,
    place: getLink(thisBot)
}

const unlockButton = {
    ...menuOptions,
    formAddress: 'lock',
    label: 'unlock',
    onClick: `@
        links.place.tags.landmarkLocked = false;
        shout('abMenuRefresh');
        shout("clearLandmarkMenu");

        links.place.onClick();
    `
}

const copyButton = {
    ...menuOptions,
    formAddress: 'content_copy',
    label: 'copy id to clipboard',
    onClick: `@
        os.setClipboard(links.place.tags.landmarkID);
        shout('clearLandmarkMenu');
    `
}

ab.links.menu.abCreateMenuButton(copyButton);

if (tags.landmarkLocked) {
    ab.links.menu.abCreateMenuButton(unlockButton); 
}