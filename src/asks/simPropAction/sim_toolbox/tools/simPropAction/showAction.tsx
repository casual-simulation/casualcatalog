if (tags.menuButton) {
    destroy(tags.menuButton);
    tags.menuButton = null;
}

const menuBot = getBot(byTag("action_menu", true), byTag("menuSimID", tags.simID));
if (menuBot) {
    destroy(menuBot);
}

if (configBot.tags.menuPortal != "action_menu") {
    configBot.tags.menuPortal = "action_menu";
}

const menuOptions = {
    action_menu: true,
    menuSimID: tags.simID,
    clearActionMenu: `@destroy(thisBot);`,
}

const tempButton = {
    ...menuOptions,
    label: tags.label,
    formAddress: tags.actionIcon ?? null,
    onPointerUp: `@`,
    onPointerDown: `@`,
    action: getLink(thisBot)
}

const menuButton = await ab.links.menu.abCreateMenuButton(tempButton);
tags.menuButton = getLink(menuButton);
