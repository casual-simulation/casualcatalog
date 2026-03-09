if (masks.tickIntervalId) {
    return;
}

if (!os.isCollaborative()) {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] canceling tick start — the inst must be collaborative.`);
    }

    return;
}

if (!thisBot.getPresenceEnabled()) {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] canceling tick start — presence is disabled.`);
    }

    return;
}

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] start interval`);
}

function tick() {
    if (tags.debug) {
        console.log(`[${tags.system}] tick`);
    }

    whisper(thisBot, 'onTick');
}

masks.tickIntervalId = setInterval(tick, tags.tickIntervalMS);
tick();