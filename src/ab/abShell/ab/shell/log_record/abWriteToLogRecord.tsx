import { RecordDataResult } from 'casualos';

let {
    ownerRecordId,
    content
} = that ?? {};

if (!ownerRecordId) {
    ownerRecordId = await ab.links.utils.getLocalUserRecordId();
}

assert(ownerRecordId, `[${tags.system}.${tagName}] ownerRecordId is a required parameter.`);
assert(content != null, `[${tags.system}] content is a required parameter`);

const logRecordName = await thisBot.abGetLogRecordName({ ownerRecordId });

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
    userRecord: logRecordName,
    recordName: address,
    recordData: data,
    toast: false,
})

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] recordDataResult:`, recordDataResult);
}

if (recordDataResult?.success) {
    return true;
} else {
    if (recordDataResult?.errorCode === 'record_not_found') {
        console.warn(`[${tags.system}.${tagName}] TODO: create log record?`);
    }

    return false;
}