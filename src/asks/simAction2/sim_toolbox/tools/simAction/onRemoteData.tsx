if (that.name == "onActionCompleted") {
    thisBot.onActionCompleted({bot: getBot("simID", that.that), remote: that.remoteId});
}

else if (that.name == "onStartMenu") {
    if (tags.startingAction == true) {
        thisBot.showAction();
    }
}