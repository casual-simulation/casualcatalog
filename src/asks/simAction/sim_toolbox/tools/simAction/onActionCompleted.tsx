if (that.bot == thisBot) {
    return;
}

const playerBot = getBot(byTag("simPlayer", true), byTag("remoteID", getID(configBot)));

//If action is part of a group
if (tags.groupTags && tags.groupTags.length != 0) {
    if (that.bot?.tags?.groupTags && that.bot?.tags?.groupTags.length != 0) {
        const matchingGroupTags = tags.groupTags.filter(tag => that.bot?.tags?.groupTags.includes(tag));
        if (matchingGroupTags.length != 0) {
            playerBot.removeActionFromQueue(tags.simID);
        }
    }
}

//If no role tags, move on
if (!tags.roleTags || tags.roleTags.length == 0) {
    return;
}

//get the player's current role tag
const currentRoleTag = getBot("simID", playerBot?.tags?.chosenRole)?.tags.roleName;

if (currentRoleTag && tags.roleTags.includes(currentRoleTag)) {
    //If this action is triggered by the action that was completed
    if (tags.actionTriggers && tags.actionTriggers.length != 0 && tags.actionTriggers.includes(that.bot?.tags?.simID)) {
        playerBot.addActionToQueue({id: tags.simID, origin: that.bot.tags.simPropReaction ? 'propReaction' : that.bot.tags.simAction ? 'action' : 'unknown'});
        return;  
    }
}