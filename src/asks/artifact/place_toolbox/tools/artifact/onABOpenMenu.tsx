if (that.menuType != 'abBotMenu' || ab.links.remember.links.abBotFocus != thisBot) {
    return;
}

const menuOptions = {
    abMenuRefresh: `@destroy(thisBot);`,
    abMenu: true,
    art: getLink(thisBot)
}

const unlockButton = {
    ...menuOptions,
    formAddress: 'lock',
    label: 'unlock',
    onClick: `@
        links.art.tags.artifactLocked = false;
        shout('abMenuRefresh');
        shout("clearArtifactMenu");

        links.art.onClick();
    `
}

if (tags.artifactLocked) {
    ab.links.menu.abCreateMenuButton(unlockButton); 
}