tags.timelinePaused = true;

if (thisBot.vars.interval) {
    clearInterval(thisBot.vars.interval);
}

tags.color = tags.prevColor;