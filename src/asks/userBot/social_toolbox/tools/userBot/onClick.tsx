shout('abMenuRefresh');
shout("clearUserBotMenu");

if (that) {
    if (that.modality == 'mouse' && that.buttonId == 'right') {
        return;
    }
}

configBot.tags.menuPortal = 'userBot_menu';

const menuOptions = {
    userBot_menu: true,
    clearUserBotMenu: `@destroy(thisBot);`,
    abMenuRefresh: "@ destroy(thisBot);",
    userBot: getLink(thisBot)
}

const pokeButton = {
    ...menuOptions,
    label: 'poke',
    userBot_menuSortOrder: 1,
    onClick: `@
        links.userBot.sendPoke();
        shout("clearUserBotMenu");
    `
}

const subscribeButton = {
    ...menuOptions,
    label: 'allow poke notifications: ' + tags.pokeNotifsAllowed,
    userBot_menuSortOrder: 1,
    onClick: `@
        links.userBot.allowPokes();
        shout("clearUserBotMenu");
    `
}

if (tags.userID == authBot?.id ) {
    if (!tags.pokeNotifsAllowed) {
        ab.links.menu.abCreateMenuButton(subscribeButton);
    }
} else {
    ab.links.menu.abCreateMenuButton(pokeButton);    
}

