let { 
    ownerRecordId
} = that ?? {};

if (!ownerRecordId) {
    ownerRecordId = await ab.links.utils.getLocalUserRecordId();
}

assert(ownerRecordId, `[${tags.system}.${tagName}] must provide a ownerRecordId.`);

const logRecordName = await thisBot.abGetLogRecordName({ ownerRecordId });

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] creating record '${logRecordName}' in ${ownerRecordId}`);
}

let isLocalUserRecordId = await ab.links.utils.isLocalUserRecordId(ownerRecordId);
let studioId;

if (!isLocalUserRecordId) {
    // Call createRecord with a studioId argument, otherwise it will be undefined and be created for the user record.
    studioId = ownerRecordId;
}
    
let createRecordResult = await os.createRecord(logRecordName, studioId);

if (!createRecordResult.success) {
    if (createRecordResult.errorCode === 'not_authorized') {
        // Ask user to grant permission;
        const permission = await os.grantInstAdminPermission(ownerRecordId);

        if (permission.success) {
            createRecordResult = await os.createRecord(logRecordName, studioId);
        }
    }
}

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] createRecordResult:`, createRecordResult);
}

let isLogRecordCreated;
if (createRecordResult.success || createRecordResult.errorCode === 'record_already_exists') {
    isLogRecordCreated = true;
} else {
    isLogRecordCreated = false;
}

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] isLogRecordCreated:`, isLogRecordCreated);
}

return isLogRecordCreated;