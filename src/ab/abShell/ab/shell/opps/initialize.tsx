const oppsEnabledParam = configBot.tags.oppsEnabled;
if (oppsEnabledParam != null && oppsEnabledParam !== '') {
    tags.oppsEnabled = oppsEnabledParam;
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] oppsEnabled overridden from URL:`, oppsEnabledParam);
    }
}

if (!tags.oppsEnabled) {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] opps disabled; skipping initialize.`);
    }
    return;
}

const userRecordId = await ab.links.utils.getLocalUserRecordId();

if (!userRecordId) {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] user is not logged in.`);
    }
    return;
}

// One-time: ensure the opp record exists. Records persist server-side, so this only needs to
// run once per inst — but the per-arrival work below must run on EVERY load (vars are wiped on
// reload and the `abFocusOpp` URL param arrives fresh each navigation).
if (!masks.initialized) {
    masks.initialized = true;

    const created = await thisBot.abCreateOppsRecord();

    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] created opps record?`, created);
    }
}

// Every arrival: repopulate the active-opp cache so the cycle has something to check.
await thisBot.abRefreshOpps();

// If we arrived here via abGoToOpp, the target opp's address rides in on the `abFocusOpp` URL
// param. Read it once per session and seed a one-shot focus intent for the cycle to consume —
// this is the only path that auto-focuses an opp's target bot.
if (!thisBot.vars.oppFocusIntentRead) {
    thisBot.vars.oppFocusIntentRead = true;
    const focusOppAddress = configBot.tags.abFocusOpp;
    if (focusOppAddress) {
        // Strip the param from the URL so a later manual reload can't re-trigger focus.
        configBot.tags.abFocusOpp = null;
        os.syncConfigBotTagsToURL(["abFocusOpp"]);

        const opp = (thisBot.vars.activeOpps ?? []).find(o => o.address === focusOppAddress);
        if (opp && opp.type === 'todo_approval' && opp.todoBotId) {
            thisBot.vars.pendingFocusOppBotId = opp.todoBotId;
            if (tags.debug) {
                console.log(`[${tags.system}.${tagName}] seeded focus intent for opp ${focusOppAddress} -> bot ${opp.todoBotId}`);
            }
        }
    }
}

thisBot.abStartOppCycle();
