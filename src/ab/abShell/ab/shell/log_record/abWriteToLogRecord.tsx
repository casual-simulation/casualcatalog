import { RecordDataResult } from 'casualos';

const {
    studioId = authBot?.id,
    content
} = that ?? {};

assert(studioId, `[${tags.system}.${tagName}] studioId is a required parameter.`);
assert(content != null, `[${tags.system}] content is a required parameter`);

const logRecordName = thisBot.getLogRecordName({ studioId });

// Metadata derived from current inst state.
const address = uuid();
const createTime = os.isCollaborative() ? os.agreedUponTime : os.localTime;
const inst = configBot.tags.inst ?? configBot.tags.staticInst ?? configBot.tags.tempInst;
const instOwner = configBot.tags.owner;

let geolocation;
const hasGeolocationPermission = await ab.links.utils.hasGeolocationPermission();
if (hasGeolocationPermission) {
    geolocation = await os.getGeolocation();

    if (geolocation.success) {
        geolocation = { latitude: geolocation.latitude, longitude: geolocation.longitude }
    }
}

let instType;
if (configBot.tags.staticInst) {
    instType = 'static';
} else if (configBot.tags.tempInst) {
    instType = 'temp';
} else if (configBot.tags.owner !== 'public') {
    instType = 'private';
} else {
    instType = 'public';
}

const data = {
    createTime,
    address,
    inst,
    instType,
    instOwner,
    content,
    geolocation,
}

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] writing to ${logRecordName}:`, data);
}

const recordDataResult: RecordDataResult = await ab.links.store.abPublishRecord({
    userRecord: studioId,
    recordName: address,
    recordData: data,
    toast: false,
})

return recordDataResult?.success;