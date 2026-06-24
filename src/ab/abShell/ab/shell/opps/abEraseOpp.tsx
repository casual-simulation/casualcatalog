let {
    address,
    ownerRecordId
} = that ?? {};

assert(address, `[${tags.system}.${tagName}] address is a required parameter.`);

const localUserRecordId = await ab.links.utils.getLocalUserRecordId();
if (!ownerRecordId) {
    ownerRecordId = localUserRecordId;
}
const isLocal = ownerRecordId === localUserRecordId;

const oppsRecordName = await thisBot.abGetOppsRecordName({ ownerRecordId });

let eraseResult = await os.eraseData(oppsRecordName, address);

if (!eraseResult?.success && eraseResult?.errorCode === 'not_authorized') {
    const permission = await os.grantInstAdminPermission(oppsRecordName);
    if (permission?.success) {
        eraseResult = await os.eraseData(oppsRecordName, address);
    }
}

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] erase opp ${address}:`, eraseResult);
}

// Drop from the in-session active cache (local user's cache only).
if (isLocal && Array.isArray(thisBot.vars.activeOpps)) {
    thisBot.vars.activeOpps = thisBot.vars.activeOpps.filter(o => o.address !== address);
    thisBot.abRefreshOppsMenu();
}

return eraseResult?.success === true;
