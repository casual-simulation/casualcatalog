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
    action: getLink(thisBot),
    onClick: `@
        if (configBot.tags.staticInst) {
            shout("onRemoteData", {
                name: "onActionCompleted",
                that: links.action.tags.simID,
                remoteId: getID(configBot)
            });
        } else {
            const remotes = await os.remotes();
            await sendRemoteData(remotes, "onActionCompleted", links.action.tags.simID);
        }
        
        if (links.action.tags.actionStory) {
            ab.log({message: links.action.tags.actionStory, space: "shared", name: "sim"});
        } else {
            ab.log({message: "completed: " + links.action.tags.label, space: "shared", name: "sim"});
        }
    `
}

const menuButton = await ab.links.menu.abCreateMenuButton(tempButton);
tags.menuButton = getLink(menuButton);
