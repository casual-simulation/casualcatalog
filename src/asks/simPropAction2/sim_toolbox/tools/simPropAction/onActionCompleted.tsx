if (that.bot == thisBot) {
    return;
}

const pageBot = getBot(byTag("simPageHandler", true));

//If this action is triggered by the action that was completed
if (tags.actionTriggers && tags.actionTriggers.length != 0 && tags.actionTriggers.includes(that.bot?.tags?.simID)) {
    pageBot.addActionToQueue({id: tags.simID, origin: that.bot.tags.simPropReaction ? 'propReaction' : that.bot.tags.simAction ? 'action' : 'unknown'});
    setTagMask(thisBot, "hideAction", false);
    return;  
}
if (tags.completionTriggers && tags.completionTriggers.length != 0 && tags.completionTriggers.includes(that.bot?.tags?.simID)) {
    pageBot.completeAction(tags.simID);
    return;  
}
if (tags.hideTriggers && tags.hideTriggers.length != 0 && tags.hideTriggers.includes(that.bot?.tags?.simID)) {
    setTagMask(thisBot, "hideAction", true);
    return;  
}
