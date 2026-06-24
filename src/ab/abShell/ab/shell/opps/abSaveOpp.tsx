// Upserts a single opp into its owner's opp record. Pass the full opp object (with `.address`)
// and it gets written in place — used for create, completion, expiry, and any other opp mutation.
// Caller is responsible for the in-session cache (add/remove/replace), since that varies by op.

if (!tags.oppsEnabled) {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] opps disabled; no-op.`);
    }
    return false;
}

let {
    opp,
    ownerRecordId
} = that ?? {};

assert(opp && opp.address, `[${tags.system}.${tagName}] an opp with an address is required.`);

const oppsRecordName = await thisBot.abGetOppsRecordName({ ownerRecordId });

const recordDataResult = await ab.links.store.abPublishRecord({
    userRecord: oppsRecordName,
    recordName: opp.address,
    recordData: opp,
    publicFacing: false,
    silent: true,
});

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] saved opp ${opp.address} to ${oppsRecordName}?`, recordDataResult?.success);
}

return recordDataResult?.success === true;
