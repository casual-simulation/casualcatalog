let {
    type,
    description,
    expireTime,
    ownerRecordId,
    ...typeProps
} = that ?? {};

assert(type, `[${tags.system}.${tagName}] type is a required parameter.`);

if (!ownerRecordId) {
    ownerRecordId = await ab.links.utils.getLocalUserRecordId();
}

assert(ownerRecordId, `[${tags.system}.${tagName}] ownerRecordId is a required parameter.`);

// Common metadata.
const address = uuid();
const createTime = os.isCollaborative() ? os.agreedUponTime : os.localTime;

// Capture geolocation if the user has granted permission.
let geolocation;
const hasGeolocationPermission = await ab.links.utils.hasGeolocationPermission();
if (hasGeolocationPermission) {
    let geo = await os.getGeolocation();
    if (geo.success) {
        geolocation = { latitude: geo.latitude, longitude: geo.longitude };
    }
}

// Type-specific props (todoBotId, inst, instOwner, instType, ...) come in via `that` and are
// spread first so common fields below always win.
const opp = {
    ...typeProps,
    address,
    type,
    description,
    createTime,
    complete: false,
    geolocation,
};

if (expireTime != null) {
    opp.expireTime = expireTime;
}

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] creating opp for owner ${ownerRecordId}:`, opp);
}

const saved = await thisBot.abSaveOpp({ opp, ownerRecordId });

if (!saved) {
    return null;
}

// Seed the in-session active cache when this opp targets the local user (so the cycle and
// abGoToOpp see it immediately, without waiting for the next abRefreshOpps).
const localUserRecordId = await ab.links.utils.getLocalUserRecordId();
if (ownerRecordId === localUserRecordId) {
    if (!Array.isArray(thisBot.vars.activeOpps)) {
        thisBot.vars.activeOpps = [];
    }
    thisBot.vars.activeOpps.push(opp);
    thisBot.abRefreshOppsMenu();
}

return opp;
