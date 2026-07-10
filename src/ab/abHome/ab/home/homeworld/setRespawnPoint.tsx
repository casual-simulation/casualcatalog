if (!authBot) {
    console.log(`[${tags.system}.${tagName}]: User must be signed in to save data`);
    await os.requestAuthBotInBackground();
}

if (!authBot) {
    console.log(`[${tags.system}.${tagName}]: User login failed.`);
    return;
}

const studio = configBot.tags.studio ?? authBot.id;
configBot.tags.selected_studioID = studio;

const metadata = {
    x: that.x,
    y: that.y
}

const publishAttempt = await ab.links.store.abPublishAB({ab: 'homeworldRespawnPoint', target: metadata, sourceEvent: 'home_respawn_publish', keepMenu: true});

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] saveData publishAttempt 1:`, publishAttempt);
}

//If saving unsuccessful
if (!publishAttempt.success) {

    //check permissions, try again
    const permissions = await os.grantInstAdminPermission(studio);

    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] saveData permissions:`, permissions);
    }

    const secondPublishAttempt = await ab.links.store.abPublishAB({ab: 'homeworldRespawnPoint', target: metadata, sourceEvent: 'home_respawn_publish', keepMenu: true});

        
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}]  saveData publishAttempt 2`, secondPublishAttempt);
    }

    if (!secondPublishAttempt.success){
        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] Could not publish`, secondPublishAttempt);
        }
        os.toast("failed to save homeworld respawn.");
        return secondPublishAttempt;
    } else {
        ab.links.manifestation.abSetAwake({ awake: true });
        os.tip("spawn point saved", 0, gridPortalBot.tags.pixelHeight);
        return secondPublishAttempt;
    }
} else {
    os.tip("spawn point saved", 0, gridPortalBot.tags.pixelHeight);
    return publishAttempt;
}