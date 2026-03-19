if(tags.cycleInterval) {
    clearInterval(tags.cycleInterval);
}

const intervalID = setInterval(() => {
    const todoBots = getBots("toDo", true);
    if (!todoBots || todoBots.length == 0) {
        clearInterval(tags.cycleInterval);
    } else {
        shout("onAgentTick");
    }
}, (1000));

setTagMask(thisBot, "cycleInterval", intervalID, "local");