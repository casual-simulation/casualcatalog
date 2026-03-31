thisBot.abStopAgentCycle();

const managerId = thisBot.id;
const cycleId = uuid();
thisBot.vars.currentCycleId = cycleId;

async function tick() {
    const manager = getBot('id', managerId);
    if (!manager) return;

    if (thisBot.vars.currentCycleId !== cycleId) {
        if (manager.tags.debug) {
            console.log(`[${manager.tags.system}.tick] Stale cycle detected at tick entry, aborting`);
        }
        return;
    }

    const myClientId = configBot.id;
    const now = os.isCollaborative() ? os.agreedUponTime : os.localTime;
    const intervalMS = manager.tags.agentCycleIntervalMS ?? 1000;
    const lockExpiry = intervalMS * 3;
    const lockIsStale = !manager.tags.executorHeartbeat ||
                        (now - manager.tags.executorHeartbeat) >= lockExpiry;

    if (manager.tags.executorClientId !== myClientId && !lockIsStale) {
        // Executor is another client and they are active.
        thisBot.vars.cycleTimeoutId = setTimeout(tick, intervalMS);
        return;
    }

    const prevExecutorClientId = manager.tags.executorClientId;
    if (prevExecutorClientId !== myClientId) {
        // Claim the lock.
        setTagMask(manager, 'executorClientId', myClientId, 'shared');

        if (prevExecutorClientId) {
            shout('onABTodoExecutorChanged', { executorClientId: myClientId });
        }
    }

    // Renew the lock.
    setTagMask(manager, 'executorHeartbeat', now, 'shared');

    if (manager.tags.debug) {
        console.log(`[${manager.tags.system}.tick] agent tick`);
    }

    await whisper(manager, 'onTodoManagerTick', { cycleId })[0];

    if (thisBot.vars.currentCycleId !== cycleId) {
        if (manager.tags.debug) {
            console.log(`[${manager.tags.system}.tick] Stale cycle detected after onTodoManagerTick whisper, aborting`);
        }
        return;
    }

    shout("onAgentTick");

    thisBot.vars.cycleTimeoutId = setTimeout(tick, intervalMS);
}

thisBot.vars.cycleTimeoutId = setTimeout(tick, 0);
