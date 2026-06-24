let {
    address,
    completionData,
    ownerRecordId
} = that ?? {};

assert(address, `[${tags.system}.${tagName}] address is a required parameter.`);

const localUserRecordId = await ab.links.utils.getLocalUserRecordId();
if (!ownerRecordId) {
    ownerRecordId = localUserRecordId;
}
const isLocal = ownerRecordId === localUserRecordId;

const oppsRecordName = await thisBot.abGetOppsRecordName({ ownerRecordId });

const getResult = await os.getData(oppsRecordName, address);
if (!getResult?.success || !getResult.data) {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] could not read opp ${address}:`, getResult);
    }
    return false;
}

// Merge optional completionData, then force the built-in complete flag + timestamp last so
// they can't be overridden by caller-supplied data.
const opp = {
    ...getResult.data,
    ...completionData,
    complete: true,
    completeTime: os.isCollaborative() ? os.agreedUponTime : os.localTime,
};

const saved = await thisBot.abSaveOpp({ opp, ownerRecordId });

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] set opp ${address} complete?`, saved);
}

// Drop from the in-session active cache (local user's cache only).
if (isLocal && Array.isArray(thisBot.vars.activeOpps)) {
    thisBot.vars.activeOpps = thisBot.vars.activeOpps.filter(o => o.address !== address);
    thisBot.abRefreshOppsMenu();
}

return saved;
