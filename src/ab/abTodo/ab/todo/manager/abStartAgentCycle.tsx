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

    const deltaTime = thisBot.vars.lastTickTime != null ? now - thisBot.vars.lastTickTime : null;
    thisBot.vars.lastTickTime = now;

    if (manager.tags.debug) {
        const deltaStr = deltaTime != null ? `${deltaTime}ms (expected ${intervalMS}ms)` : 'first tick';
        console.log(`[${manager.tags.system}.tick] agent tick | deltaTime: ${deltaStr}`);
    }

    await whisper(manager, 'onTodoManagerTick', { cycleId, tickIntervalMS: intervalMS, deltaTime })[0];

    if (thisBot.vars.currentCycleId !== cycleId) {
        if (manager.tags.debug) {
            console.log(`[${manager.tags.system}.tick] Stale cycle detected after onTodoManagerTick whisper, aborting`);
        }
        return;
    }

    shout("onAgentTick", { tickIntervalMS: intervalMS, deltaTime });

    thisBot.vars.cycleTimeoutId = setTimeout(tick, intervalMS);
}

thisBot.vars.cycleTimeoutId = setTimeout(tick, 0);
