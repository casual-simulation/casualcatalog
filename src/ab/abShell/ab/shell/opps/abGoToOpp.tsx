if (!tags.oppsEnabled) {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] opps disabled; no-op.`);
    }
    return false;
}

let {
    address
} = that ?? {};

assert(address, `[${tags.system}.${tagName}] address is a required parameter.`);

// Resolve the opp from the in-session cache, falling back to a record read.
let opp = (thisBot.vars.activeOpps ?? []).find(o => o.address === address);
if (!opp) {
    const oppsRecordName = await thisBot.abGetOppsRecordName();
    const getResult = await os.getData(oppsRecordName, address);
    opp = getResult?.success ? getResult.data : null;
}

if (!opp) {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] opp ${address} not found`);
    }
    return false;
}

// Per-type focus target.
let focusBotId;
if (opp.type === 'todo_approval') {
    focusBotId = opp.todoBotId;
}

// Already in the opp's target inst? Focus directly instead of reloading.
const { inst: currentInst, instOwner: currentOwner } = ab.links.utils.getCurrentInstInfo();
const sameInst = opp.inst === currentInst && (opp.instOwner ?? null) === (currentOwner ?? null);

if (sameInst) {
    if (focusBotId) {
        const focusBot = getBot('id', focusBotId);
        if (focusBot) {
            os.focusOn(focusBot).catch(() => {});
        } else {
            // Bot not streamed in yet — let the cycle focus it once it appears.
            thisBot.vars.pendingFocusOppBotId = focusBotId;
        }
    }
    return true;
}

// Different inst — navigate there, carrying the focus intent across the reload via a URL param
// (consumed once on arrival in initialize -> cycle).
const newURL = new URL(new URL(configBot.tags.url).origin);

if (configBot.tags.comId) {
    newURL.searchParams.append('comId', configBot.tags.comId);
}

if (opp.instType === 'static') {
    newURL.searchParams.append('staticInst', opp.inst);
} else if (opp.instType === 'temp') {
    newURL.searchParams.append('tempInst', opp.inst);
} else {
    newURL.searchParams.append('inst', opp.inst);
    if (opp.instOwner) {
        newURL.searchParams.append('owner', opp.instOwner);
    }
}

// Land in the dimension the opp's target bot renders in, so focus-on-arrival has something
// visible to focus.
if (opp.dimension) {
    newURL.searchParams.append('gridPortal', opp.dimension);
}

newURL.searchParams.append('abFocusOpp', address);

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] navigating to opp ${address}: ${newURL.href}`);
}

os.goToURL(newURL.href);

return true;
