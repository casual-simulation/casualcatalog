let { 
    ownerRecordId
} = that ?? {};

if (!ownerRecordId) {
    const authBot = await os.requestAuthBotInBackground();
    ownerRecordId = authBot?.id;
}

assert(ownerRecordId, `[${tags.system}.${tagName}] ownerRecordId is a required parameter.`);

let logRecordName = `${tags.logRecordPrefix}_${ownerRecordId}`;

return logRecordName;