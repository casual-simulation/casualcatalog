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
