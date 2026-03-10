if (tags.cycleState == 'off') {

    setTagMask(thisBot, "progressBar", "0", "local");
    setTagMask(thisBot, "progressBarBackgroundColor", "#8995a3", "local");
    setTagMask(thisBot, "progressBarColor", "#0073ff", "local");

    setTagMask(thisBot, "color", "#0073ff", "local");
    setTagMask(thisBot, "label", "pause", "local");
    setTagMask(thisBot, "cycleState", "on", "local");

    if(tags.cycleInterval) {
        clearInterval(tags.cycleInterval);
    }

    const intervalID = setInterval(() => {
        shout("onTick");
    }, (1000 / 30));

    setTagMask(thisBot, "cycleInterval", intervalID, "local");

} else {

    if(tags.cycleInterval) {
        clearInterval(tags.cycleInterval);
    }

    setTagMask(thisBot, "cycleInterval", null, "local");

    setTagMask(thisBot, "progressBar", "0", "local");
    setTagMask(thisBot, "progressBarBackgroundColor", "clear", "local");
    setTagMask(thisBot, "progressBarColor", "clear", "local");

    setTagMask(thisBot, "color", "#8995a3", "local");
    setTagMask(thisBot, "label", "play", "local");
    setTagMask(thisBot, "cycleState", "off", "local");
}

