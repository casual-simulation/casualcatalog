if (that.name == "onActionCompleted") {
    if (that.remoteId == getID(configBot)) {
        thisBot.completeAction(that.that);
    }
}

else if (that.name == "onStartMenu") {

    setTagMask(thisBot, "simStarted", true, "tempShared");

    const simXPBot = getBot(byTag("xp", true), byTag("xpType", "sim"), byTag("simUser", authBot.id));
    const roleBot = getBot("simID", simXPBot?.tags?.chosenRole);

    // if (simXPBot && roleBot.tags.simAttributes) {
    //     simXPBot.tags.playerStats = roleBot.tags.simAttributes;
    // }
    setTagMask(roleBot, "simAttributes", null);

    shout("clearActionMenu");
    shout("clearRoleStats");
    shout('abMenuRefresh');

    if (configBot.tags.menuPortal != 'action_menu') {
       configBot.tags.menuPortal = 'action_menu'; 
    }

    simXPBot.tags.queuedActions = [];
    simXPBot.tags.completedActions = [];

    const actionBots = getBots(byTag("simAction", true), byTag("startingAction", true));
    for (let i = 0; i < actionBots.length; ++i) {
        if (actionBots[i].tags.roleTags && actionBots[i].tags.roleTags.length != 0) {
            if(actionBots[i].tags.roleTags.includes(roleBot.tags.roleName)) {
                thisBot.addActionToQueue({id: actionBots[i].tags.simID, origin: 'startingAction'});
            }
        }
    }
}