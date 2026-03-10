if (thisBot.vars.saveTimout) {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] clear save timeout.`);
    }
    clearTimeout(thisBot.vars.saveTimout);
    thisBot.vars.saveTimout = null;
}

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] start save timeout ${tags.saveDelayMS}ms`);
}

thisBot.vars.saveTimout = await setTimeout(() => {
    thisBot.saveData();
}, tags.saveDelayMS);