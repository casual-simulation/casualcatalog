if (that.name == "onActionCompleted") {
    if (that.remoteId == getID(configBot)) {
        thisBot.completeAction(that.that);
    }
}

else if (that.name == "onStartMenu") {

    setTagMask(thisBot, "simStarted", true, "tempLocal");

    shout("clearActionMenu");
    shout("clearRoleStats");
    shout('abMenuRefresh');

    if (configBot.tags.menuPortal != 'action_menu') {
       configBot.tags.menuPortal = 'action_menu'; 
    }

    tags.queuedActions = [];
    tags.completedActions = [];

    const actionBots = getBots(byTag("simAction", true), byTag("startingAction", true));
    for (let i = 0; i < actionBots.length; ++i) {
        thisBot.addActionToQueue({id: actionBots[i].tags.simID, origin: 'startingAction'});
    }
}