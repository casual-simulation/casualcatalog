if (tags.propReactionType == 'onClick') {
    if (tags.actionTriggers && tags.actionTriggers.length > 0) {
        if (tags.actionTriggers.includes(that.bot.tags.simID) && that.bot.tags.propLocked) {
            //Activate completion for this reaction

            const pageBot = getBot("simPageHandler", true);
            if (pageBot) {
                pageBot.completeAction(tags.simID);
            }
        }
    }
}