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