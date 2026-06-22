thisBot.vars.currentOppCycleId = null;

if (thisBot.vars.oppCycleTimeoutId) {
    clearTimeout(thisBot.vars.oppCycleTimeoutId);
    thisBot.vars.oppCycleTimeoutId = null;
}
