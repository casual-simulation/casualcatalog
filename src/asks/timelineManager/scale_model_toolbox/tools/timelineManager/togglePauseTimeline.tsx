if (thisBot.vars.interval) {
    clearInterval(thisBot.vars.interval);
}

if (tags.timelinePaused) {
    thisBot.vars.interval = setInterval(() => {
        thisBot.increaseStep();
    }, 1000);

    tags.timelinePaused = false;
} else {
    tags.timelinePaused = true;
}