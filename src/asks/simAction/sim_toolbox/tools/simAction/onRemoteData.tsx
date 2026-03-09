if (that.name == "onActionCompleted") {
    thisBot.onActionCompleted({bot: getBot("simID", that.that), remote: that.remoteId});
}

else if (that.name == "onStartMenu") {
    if (tags.startingAction == true) {
        if (!tags.roleTags || tags.roleTags.length == 0) {
            thisBot.showAction();
        } else {
           const currentRoleTag = getBot("roleOwner", getID(configBot))?.tags.roleName;
            if (currentRoleTag && tags.roleTags.includes(currentRoleTag)) {
                thisBot.showAction();
            } 
        }
    }
}