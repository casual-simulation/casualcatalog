if (thisBot.vars.resetting) {
    return;
}

thisBot.vars.resetting = true;

if (!authBot) {
    try { 
        await os.requestAuthBotInBackground();
    } catch {
        thisBot.vars.resetting = false;
        return;
    }
}

if (!links.remember) {
    thisBot.vars.resetting = false;
    return;
}

// Clear any loaded tags.
clearTagMasks(thisBot, 'local');

if (authBot) {
    // Save an empty object to the user's record.
    let recordResponse = await os.recordData(authBot.id, 'abPersonalityConfig', {});

    if (!recordResponse.success) {
        if (recordResponse.errorCode === 'not_authorized') {
            // Ask user to grant permission;
            const permission = await os.grantInstAdminPermission(authBot.id);

            if (permission.success) {
                recordResponse = await os.recordData(authBot.id, 'abPersonalityConfig', {});
            }
        }
    }
}

// Reload the personality. With the user personality erased, this will effectively load all the defaults from abConfig.
await thisBot.abPersonalityLoad();

thisBot.vars.resetting = false;