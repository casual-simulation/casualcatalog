//Check for user logged in
if (!authBot) {
    console.log(`[${tags.system}.${tagName}]: User must be signed in to save data`);
    await os.requestAuthBotInBackground();
}

if (!authBot) {
    console.log(`[${tags.system}.${tagName}]: User login failed.`);
    return;
}

// Naively update all artifact shards in this inst before we save.
await ab.links.artifact.abUpdateAllArtifactShards();

//Grab data to be saved
const studio = configBot.tags.studio ?? authBot.id;
configBot.tags.selected_studioID = studio;

const homeBots = getBots(byTag('home', true), not(byTag("system", sys => sys?.substring(0, 3) == 'ab.')), not(byTag("abIgnore", true)), byTag("space", 'shared'));

const publishAttempt = await ab.links.store.abPublishAB({ab: 'home', target: homeBots, sourceEvent: 'home_egg_publish', keepMenu: true});

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] saveData publishAttempt 1:`, publishAttempt);
}

//If saving unsuccessful
if (!publishAttempt.success) {

    //check permissions, try again
    console.log(`[${tags.system}.${tagName}] requesting inst admin permission for studio ${studio}.`);
    const permissions = await os.grantInstAdminPermission(studio);

    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] saveData permissions:`, permissions);
    }

    const secondPublishAttempt = await ab.links.store.abPublishAB({ab: 'home', target: homeBots, sourceEvent: 'home_egg_publish', keepMenu: true});
        
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}]  saveData publishAttempt 2`, secondPublishAttempt);
    }

    if (!secondPublishAttempt.success){
        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] Could not publish`, secondPublishAttempt);
        }
        os.toast("failed to save homeworld.");
        return secondPublishAttempt;
    } else {
        ab.links.manifestation.abSetAwake({ awake: true });
        os.tip("home world saved", 0, gridPortalBot.tags.pixelHeight);
        return secondPublishAttempt;
    }
} else {
    os.tip("home world saved", 0, gridPortalBot.tags.pixelHeight);
    return publishAttempt;
}