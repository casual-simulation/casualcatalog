let { 
    recordId
} = that ?? {};

if (!recordId) {
    const authBot = await os.requestAuthBotInBackground();
    recordId = authBot?.id;
}

assert(recordId, `[${tags.system}.${tagName}] recordId is a required parameter.`);

let logRecordName = `${tags.logRecordPrefix}_${recordId}`;

return logRecordName;