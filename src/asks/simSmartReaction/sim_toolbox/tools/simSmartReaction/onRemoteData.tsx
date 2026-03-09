if (that.name == "onActionCompleted" && that.remoteId == getID(configBot)) {
    thisBot.onActionCompleted(getBot("simID", that.that));
}

else if (that.name == "onActionAddedToQueue" && that.remoteId == getID(configBot)) {
    thisBot.onActionCompleted(getBot("simID", that.that));
}