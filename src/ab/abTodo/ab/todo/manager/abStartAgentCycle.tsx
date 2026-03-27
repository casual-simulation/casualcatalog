thisBot.abStopAgentCycle();

async function tick() {
    try {
        await whisper(thisBot, 'onTodoManagerTick')[0];

        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] agent tick`);
        }
        shout("onAgentTick");
    } finally {
        thisBot.vars.cycleTimeoutId = setTimeout(tick, tags.agentCycleIntervalMS ?? 1000);
    }

}

thisBot.vars.cycleTimeoutId = setTimeout(tick, 0);
