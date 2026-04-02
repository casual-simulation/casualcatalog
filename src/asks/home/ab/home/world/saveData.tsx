if (!authBot) {
    console.log("[ab.home.egg]: saveData no authbot");
    await os.requestAuthBotInBackground();
}

if (!authBot) {
    console.log("[ab.home.egg]: User not logged in.");
    return;
}

if (!tags.saveEnabled) {
    return;
}

const studio = configBot.tags.studio ?? authBot.id;
configBot.tags.selected_studioID = studio;

const currentDim = ab.links.remember.tags.abActiveDimension ?? 'home';
const homeBots = getBots(byTag(currentDim, true), not(byTag("system", sys => sys?.substring(0, 3) == 'ab.')), not(byTag("abIgnore", true)), byTag("space", 'shared'));

const publishAttempt = await ab.links.store.abPublishAB({ab: 'home', target: homeBots, sourceEvent: 'home_egg_publish', keepMenu: true});

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] saveData publishAttempt 1:`, publishAttempt);
}

if (!publishAttempt.success) {
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
    } else {
        ab.links.manifestation.abSetAwake({ awake: true });
        os.tip("home world saved", 0, gridPortalBot.tags.pixelHeight);
    }
} else {
    os.tip("home world saved", 0, gridPortalBot.tags.pixelHeight);
}