let { 
    ownerRecordId
} = that ?? {};

if (!ownerRecordId) {
    ownerRecordId = await ab.links.utils.getLocalUserRecordId();
}

assert(ownerRecordId, `[${tags.system}.${tagName}] ownerRecordId is a required parameter.`);

let oppsRecordName = `${tags.oppsRecordPrefix}_${ownerRecordId}`;

return oppsRecordName;