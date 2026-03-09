if (tags.propReactionType == 'onDrag') {
    if (tags.actionTriggers && tags.actionTriggers.length > 0) {
        if (tags.actionTriggers.includes(that.bot.tags.simID)) {
            //Activate completion for this reaction

            if (configBot.tags.staticInst) {
                shout("onRemoteData", {
                    name: "onActionCompleted",
                    that: tags.simID,
                    remoteId: getID(configBot)
                });
            } else {
                const remotes = await os.remotes();
                await sendRemoteData(remotes, "onActionCompleted", tags.simID);
            }
        }
    }
}