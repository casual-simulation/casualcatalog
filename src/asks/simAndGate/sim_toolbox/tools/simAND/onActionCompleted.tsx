if (that.bot == thisBot) {
    return;
}

const pageBot = getBot(byTag("simPageHandler", true));

//If this action is triggered by the action that was completed
if (tags.actionTriggers && tags.actionTriggers.length != 0 && tags.actionTriggers.includes(that.bot?.tags?.simID)) {
    if (pageBot.tags.completedQueue && pageBot.tags.completedQueue.length != 0) {
        let completed = true;
        for (const simID of tags.actionTriggers) {
            if (pageBot.tags.completedQueue.includes(simID)) {
                continue;
            } else {
                completed = false;
                break;
            }
        }
        if (completed) {
            pageBot.completeAction(tags.simID);
        }
    }   
}