if (that.name == "onActionCompleted") {
    thisBot.onActionCompleted({bot: getBot("simID", that.that), remote: that.remoteId});
}