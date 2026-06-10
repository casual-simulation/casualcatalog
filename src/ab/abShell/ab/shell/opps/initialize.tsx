if (masks.initialized) {
    return;
}

const userRecordId = await ab.links.utils.getLocalUserRecordId();

if (userRecordId) {
    const created = await thisBot.abCreateOppsRecord();

    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] created opps log record?`, created);
    }
} else {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] user is not logged in.`);
    }
}

masks.initialized = true;