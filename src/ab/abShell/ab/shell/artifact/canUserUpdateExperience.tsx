const {
    remoteId = configBot.id,
    shardBot
} = that ?? {}

if (shardBot && 
    shardBot.tags.abArtifactName &&
    shardBot.tags.abArtifactInstanceID
) {
    // Need to figure out if this user is allowed to update the experience of this artifact instance.
    let canUserUpdate = false;

    switch (shardBot.space) {
        case 'shared':
            canUserUpdate = true;
        case 'tempShared':
            // tempShared space means that this bot is basically owned by this user.
            canUserUpdate = true;
            break;
        case 'remoteTempShared':
            // remoteTempShared space means that this bot is owned by someone else.
            canUserUpdate = false;
            break;
        case 'local':
            canUserUpdate = true;
            break;
        case 'tempLocal':
            canUserUpdate = true;
            break;
        default:
            console.error(`[${tags.system}.${tagName}] Unrecognized bot space:`, shardBot.space);
            break;
    }

    return canUserUpdate;
} else {
    if (tags.debugExp) {
        console.warn(`[${tags.system}.${tagName}] provided shardBot does not appear to be from an artifact instance.`, shardBot);
    }
    return false;
}