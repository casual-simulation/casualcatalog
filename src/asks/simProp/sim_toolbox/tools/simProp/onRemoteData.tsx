if (that.name == "onStartMenu") {
    if (tags.simAttributesStartingValues) {
        tags.simAttributes = tags.simAttributesStartingValues;
    }

    thisBot.setProgressBar();
    shout("clearPropStatsMenu");
    shout('abMenuRefresh');
}