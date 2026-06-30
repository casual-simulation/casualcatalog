if (that.bot == thisBot) {
    return;
}

const pageBot = getBot(byTag("simPageHandler", true));

//If this action is triggered by the action that was completed
if (tags.actionTriggers && tags.actionTriggers.length != 0 && tags.actionTriggers.includes(that.bot?.tags?.simID)) {
    pageBot.completeAction(tags.simID);
}