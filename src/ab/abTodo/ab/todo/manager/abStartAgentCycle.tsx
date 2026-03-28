thisBot.abStopAgentCycle();

const managerId = thisBot.id;

async function tick() {
    const manager = getBot('id', managerId);
    if (!manager) return;

    const myClientId = configBot.id;
    const now = os.isCollaborative() ? os.agreedUponTime : os.localTime;
    const intervalMS = manager.tags.agentCycleIntervalMS ?? 1000;
    const lockExpiry = intervalMS * 3;
    const lockIsStale = !manager.tags.executorHeartbeat ||
                        (now - manager.tags.executorHeartbeat) >= lockExpiry;

    if (manager.tags.executorClientId !== myClientId && !lockIsStale) {
        thisBot.vars.cycleTimeoutId = setTimeout(tick, intervalMS);
        return;
    }

    const prevExecutorClientId = manager.tags.executorClientId;
    if (prevExecutorClientId && prevExecutorClientId !== myClientId) {
        // Claim the lock.
        setTagMask(manager, 'executorClientId', myClientId, 'shared');

        shout('onABTodoExecutorChanged', { executorClientId: myClientId });
    }
    
    // Renew the lock.
    setTagMask(manager, 'executorHeartbeat', now, 'shared');

    if (manager.tags.debug) {
        console.log(`[${manager.tags.system}.${tagName}] agent tick`);
    }

    await whisper(manager, 'onTodoManagerTick')[0];
    shout("onAgentTick");

    thisBot.vars.cycleTimeoutId = setTimeout(tick, intervalMS);
}

thisBot.vars.cycleTimeoutId = setTimeout(tick, 0);
