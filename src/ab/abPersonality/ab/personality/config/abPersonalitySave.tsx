if (thisBot.vars.saving) {
    return;
}

thisBot.vars.saving = true;

if (!authBot) {
    try { 
        await os.requestAuthBotInBackground();
    } catch {
        thisBot.vars.saving = false;
        return;
    }
}

// Save all the current ab personality tags to the user's record.
const userPersonality = {};

for (const tagName of tags.abPersonalityTags) {
    if (tags[tagName] != null) {
        userPersonality[tagName] = tags[tagName];
    }
}

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] saving user personality:`, self.structuredClone(userPersonality));
}

let recordResponse = await os.recordData(authBot.id, 'abPersonalityConfig', userPersonality);

if (!recordResponse.success) {
    if (recordResponse.errorCode === 'not_authorized') {
        // Ask user to grant permission;
        const permission = await os.grantInstAdminPermission(authBot.id);

        if (permission.success) {
            recordResponse = await os.recordData(authBot.id, 'abPersonalityConfig', userPersonality);
        }
    }
}

if (recordResponse.success) {
    ab.links.utils.abLog({ message: `updated personality config in user record`, logType: 'log'});
} else {
    ab.links.utils.abLog({ message: `failed to update personality config in user record.\n${JSON.stringify(recordResponse, undefined, 2)}`, logType: 'error'});
}

thisBot.vars.saving = false;
thisBot.vars.hasUnsavedChanges = false;