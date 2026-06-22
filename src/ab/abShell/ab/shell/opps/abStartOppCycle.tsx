"-energy"

thisBot.abStopOppCycle();

const managerId = thisBot.id;
const cycleId = uuid();
thisBot.vars.currentOppCycleId = cycleId;

async function tick() {
    const manager = getBot('id', managerId);
    if (!manager) return;

    if (manager.vars.currentOppCycleId !== cycleId) {
        if (manager.tags.debug) {
            console.log(`[${manager.tags.system}.oppTick] Stale cycle detected, aborting`);
        }
        return;
    }

    const intervalMS = manager.tags.oppCycleIntervalMS ?? 2000;
    const now = os.isCollaborative() ? os.agreedUponTime : os.localTime;

    try {
        // Consume a one-shot focus intent (seeded by initialize when arriving via abGoToOpp,
        // or by abGoToOpp itself in the same-inst case). Focus happens ONLY here — never
        // automatically just because an opp's bot is present.
        const pendingFocusId = manager.vars.pendingFocusOppBotId;
        if (pendingFocusId) {
            const focusBot = getBot('id', pendingFocusId);
            if (focusBot) {
                os.focusOn(focusBot).catch(() => {});
                manager.vars.pendingFocusOppBotId = null;
                if (manager.tags.debug) {
                    console.log(`[${manager.tags.system}.oppTick] focused opp target bot ${pendingFocusId}`);
                }
            }
        }

        const activeOpps = Array.isArray(manager.vars.activeOpps) ? [...manager.vars.activeOpps] : [];

        for (const opp of activeOpps) {
            // (a) Expire check.
            if (opp.expireTime != null && now >= opp.expireTime) {
                if (manager.tags.debug) {
                    console.log(`[${manager.tags.system}.oppTick] opp ${opp.address} expired`);
                }
                opp.expired = true;
                await manager.abSaveOpp({ opp });
                manager.vars.activeOpps = (manager.vars.activeOpps ?? []).filter(o => o.address !== opp.address);
                continue;
            }

            // (b) Dispatch to the per-type completion checker.
            if (opp.type === 'todo_approval') {
                await manager.abCheckOppTodoApproval({ opp });
            }

            if (manager.vars.currentOppCycleId !== cycleId) return;
        }
    } catch (e) {
        if (manager.tags.debug) {
            console.error(`[${manager.tags.system}.oppTick] tick error:`, e);
        }
    }

    if (manager.vars.currentOppCycleId !== cycleId) return;
    manager.vars.oppCycleTimeoutId = setTimeout(tick, intervalMS);
}

thisBot.vars.oppCycleTimeoutId = setTimeout(tick, 0);
