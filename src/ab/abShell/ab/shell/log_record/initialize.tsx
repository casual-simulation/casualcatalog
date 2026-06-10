if (masks.initialized) {
    return;
}

const userRecordId = await ab.links.utils.getLocalUserRecordId();

if (userRecordId) {
    const created = await thisBot.abCreateLogRecord();

    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] created user log record?`, created);
    }
} else {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] user is not logged in.`);
    }
}

masks.initialized = true;