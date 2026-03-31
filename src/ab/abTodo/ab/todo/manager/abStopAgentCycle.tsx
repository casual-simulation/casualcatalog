thisBot.vars.currentCycleId = null;

if (thisBot.vars.cycleTimeoutId) {
    clearTimeout(thisBot.vars.cycleTimeoutId);
    thisBot.vars.cycleTimeoutId = null;
}