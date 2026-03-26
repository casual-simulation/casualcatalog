thisBot.abStopAgentCycle();

async function tick() {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] agent tick`);
    }

    await whisper(thisBot, 'onTodoManagerTick')[0];
    shout("onAgentTick");

    thisBot.vars.cycleTimeoutId = setTimeout(tick, tags.agentCycleIntervalMS ?? 1000);
}

thisBot.vars.cycleTimeoutId = setTimeout(tick, 0);
