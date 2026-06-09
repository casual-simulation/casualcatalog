//retrieve specified record
let recordName = that.recordName;

let recordKey = links.remember.tags.abRecordKey;

if (that.recordKey)
{
    recordKey = that.recordKey;
}
else if (authBot)
{
    if (authBot.id == configBot.tags.studio)
    {
        recordKey = authBot.id;

        await os.grantInstAdminPermission(recordKey);
    }
}

let recordEndpoint = that.recordEndpoint ? that.recordEndpoint : links.remember.tags.abEndpoint;

if (!recordName)
{
    return "no record name supplied";
}

let getRecord = await os.getData(recordKey, recordName, recordEndpoint);

//ADD additional error handling?

return getRecord;