if (thisBot.vars.refreshCreditsTimeoutId) {
    clearTimeout(thisBot.vars.refreshCreditsTimeoutId);
    thisBot.vars.refreshCreditsTimeoutId = null;
}

const cycleId = uuid();
thisBot.vars.currentCycleId = cycleId;

if (thisBot.vars.currentCycleId !== cycleId) {
    return;
}

// The preact app is listening for this whisper.
await whisper(thisBot, 'refreshCreditsDisplay')[0];

if (thisBot.vars.currentCycleId !== cycleId) {
    return;
}

thisBot.vars.refreshCreditsTimeoutId = setTimeout(() => { whisper(thisBot, 'abXPERefreshCreditsDisplay') }, tags.creditsRefreshTimeoutMS)