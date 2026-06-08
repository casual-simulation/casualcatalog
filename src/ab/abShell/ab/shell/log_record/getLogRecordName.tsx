const { 
    studioId = authBot?.id
} = that ?? {};

assert(studioId, `[${tags.system}.${tagName}] studioId is a required parameter.`);

let logRecordName = `log_${studioId}`;

return logRecordName;