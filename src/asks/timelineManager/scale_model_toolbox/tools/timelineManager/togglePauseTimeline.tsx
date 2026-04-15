if (thisBot.vars.interval) {
    clearInterval(thisBot.vars.interval);
}

if (tags.timelinePaused) {
    thisBot.vars.interval = setInterval(() => {
        thisBot.increaseStep();
    }, 1000);

    tags.timelinePaused = false;
    tags.prevColor = tags.color;
    tags.color = '#519e2e';
} else {
    tags.timelinePaused = true;
    tags.color = tags.prevColor;
}