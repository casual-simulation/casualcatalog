"-energy"

// Completion checker for `todo_approval` opps. Called once per active opp per cycle tick.

const { opp } = that ?? {};
if (!opp || !opp.todoBotId) return;

// Inst-gate: the approval bot only exists in the opp's target inst, so we can only observe it
// from there. Outside that inst, "bot missing" means "not loaded here", not "addressed".
const { inst: currentInst, instType: currentInstType, instOwner: currentOwner } = ab.links.utils.getCurrentInstInfo();

const inTargetInst =
    opp.inst === currentInst &&
    opp.instOwner === currentOwner &&
    opp.instType === currentInstType;

if (!inTargetInst) {
    return;
}

if (!thisBot.vars.oppSeen) {
    thisBot.vars.oppSeen = {};
}
const seen = thisBot.vars.oppSeen;

const bot = getBot('id', opp.todoBotId);

if (bot) {
    // Mark as seen so a later disappearance counts as "addressed" rather than "not loaded".
    seen[opp.address] = true;

    if (bot.tags.todoApproved || bot.tags.abTodoComplete) {
        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] opp ${opp.address} approved/complete -> completing`);
        }
        await thisBot.abSetOppComplete({ address: opp.address });
    }
    return;
}

// Bot is missing. Only treat as addressed (restart/cancel both destroy the approval bot) if we
// saw it present earlier this session. Never-seen + missing = still streaming in -> skip.
if (seen[opp.address]) {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] opp ${opp.address} target bot gone after being seen -> addressed, completing`);
    }
    await thisBot.abSetOppComplete({ address: opp.address });
}
