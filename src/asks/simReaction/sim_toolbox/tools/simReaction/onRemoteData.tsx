if (that.name == "onActionCompleted" && that.remoteId == getID(configBot)) {
    thisBot.onActionCompleted(getBot("simID", that.that));
}