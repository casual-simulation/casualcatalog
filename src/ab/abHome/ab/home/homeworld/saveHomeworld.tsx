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
        os.toast("failed to save homelayer.");
        return secondPublishAttempt;
    } else {
        ab.links.manifestation.abSetAwake({ awake: true });
        os.tip("home layer saved", 0, gridPortalBot.tags.pixelHeight);
        if (links.save) {
            setTagMask(links.save, "newChanges", null, "shared");
        }
        return secondPublishAttempt;
    }
} else {
    os.tip("home layer saved", 0, gridPortalBot.tags.pixelHeight);
    if (links.save) {
        setTagMask(links.save, "newChanges", null, "shared");
    }
    return publishAttempt;
}