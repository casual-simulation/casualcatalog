// Refresh active opps into the in-session cache. Reads an opp record (the local user's by
// default, or another user's via ownerRecordId) and keeps only opps that are neither complete
// nor expired. The cache + seen-tracking are only updated when refreshing the LOCAL user's
// record, since the cycle watches that cache.

if (!tags.oppsEnabled) {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] opps disabled; no-op.`);
    }
    return [];
}

let {
    ownerRecordId
} = that ?? {};

const localUserRecordId = await ab.links.utils.getLocalUserRecordId();
if (!ownerRecordId) {
    ownerRecordId = localUserRecordId;
}
const isLocal = ownerRecordId === localUserRecordId;

const oppsRecordName = await thisBot.abGetOppsRecordName({ ownerRecordId });

const activeOpps = [];
let cursor;
let triedGrant = false;

// Page through the whole record until an empty page; no fixed cap, so it scales past any
// number of opps.
while (true) {
    const result = await os.listData(oppsRecordName, cursor);

    if (!result?.success) {
        if (result?.errorCode === 'not_authorized' && !triedGrant) {
            triedGrant = true;
            const permission = await os.grantInstAdminPermission(oppsRecordName);
            if (permission?.success) {
                continue; // retry the same cursor with permission granted
            }
        }
        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] listData failed:`, result);
        }
        break;
    }

    const items = result.items ?? [];
    for (const item of items) {
        const opp = item.data;
        if (opp && !opp.complete && !opp.expired) {
            activeOpps.push(opp);
        }
    }

    if (items.length === 0) {
        break;
    }
    cursor = items[items.length - 1].address;
}

// Only the local user's opps drive the cycle's cache + seen-tracking.
if (isLocal) {
    thisBot.vars.activeOpps = activeOpps;

    // Carry forward per-opp "seen" tracking, but only for opps still active.
    const prevSeen = thisBot.vars.oppSeen ?? {};
    const nextSeen = {};
    for (const opp of activeOpps) {
        if (prevSeen[opp.address]) {
            nextSeen[opp.address] = true;
        }
    }
    thisBot.vars.oppSeen = nextSeen;
} else {
    console.error(`[${tags.system}.${tagName}] refreshed opps for non-local user ${ownerRecordId} — not updating in-session cache or seen-tracking`);
}

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] refreshed ${activeOpps.length} active opp(s) for ${ownerRecordId}`);
}

return activeOpps;
