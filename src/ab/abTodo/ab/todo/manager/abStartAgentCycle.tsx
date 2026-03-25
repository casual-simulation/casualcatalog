thisBot.abStopAgentCycle();

thisBot.vars.cycleIntervalId = setInterval(() => {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] agent tick`);
    }

    shout("onAgentTick");
}, tags.agentCycleIntervalMS ?? 1000);