const { 
    studioId = authBot?.id,
} = that ?? {};

assert(studioId, `[${tags.system}.${tagName}] studioId is a required parameter.`);

const logRecordName = thisBot.getLogRecordName({ studioId });

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] creating record '${logRecordName}' in ${studioId}`);
}

const createRecordResult = await os.createRecord(recordName, studioId);

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] createRecordResult:`, createRecordResult);
}