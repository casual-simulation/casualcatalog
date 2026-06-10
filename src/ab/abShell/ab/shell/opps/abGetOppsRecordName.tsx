let { 
    ownerRecordId
} = that ?? {};

if (!ownerRecordId) {
    const authBot = await os.requestAuthBotInBackground();
    ownerRecordId = authBot?.id;
}

assert(ownerRecordId, `[${tags.system}.${tagName}] ownerRecordId is a required parameter.`);

let oppsRecordName = `${tags.oppsRecordPrefix}_${ownerRecordId}`;

return oppsRecordName;