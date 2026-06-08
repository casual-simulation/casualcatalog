const { 
    studioId = authBot?.id
} = that ?? {};

assert(studioId, `[${tags.system}.${tagName}] studioId is a required parameter.`);

const name = thisBot.getLogRecordName({ studioId });

const listRecordsResult = await os.listStudioRecord(studioId);

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] listRecordsResult:`, listRecordsResult);
}