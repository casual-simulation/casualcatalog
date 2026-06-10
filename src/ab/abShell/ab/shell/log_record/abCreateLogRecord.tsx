let { 
    recordId
} = that ?? {};

if (!recordId) {
    const authBot = await os.requestAuthBotInBackground();
    recordId = authBot?.id;
}

assert(recordId, `[${tags.system}.${tagName}] must provide a recordId.`);

const logRecordName = await thisBot.abGetLogRecordName({ recordId });

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] creating record '${logRecordName}' in ${recordId}`);
}

let isLocalUserRecordId = await ab.links.utils.isLocalUserRecordId(recordId);
let studioId;

if (!isLocalUserRecordId) {
    // Call createRecord with a studioId argument, otherwise it will be undefined and be created for the user record.
    studioId = recordId;
}
    
let createRecordResult = await os.createRecord(logRecordName, studioId);

if (!createRecordResult.success) {
    if (createRecordResult.errorCode === 'not_authorized') {
        // Ask user to grant permission;
        const permission = await os.grantInstAdminPermission(recordId);

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