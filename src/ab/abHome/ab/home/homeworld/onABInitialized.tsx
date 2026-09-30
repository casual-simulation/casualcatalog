// superShout("instCheckin", configBot.tags);
configBot.tags.abStayAwake = null;
os.syncConfigBotTagsToURL(["abStayAwake"]);
await os.sleep(0);

if (ab.abIsPrimary()) {
    setTagMask(links.remember, "mapPreventFocus", true);
    links.manifestation.abSetAwake({ awake: true })
} else {
    links.manifestation.abSetAwake({ awake: false })
}

//Check login
if (!authBot) {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] authBot not found`);
    }
    await os.requestAuthBot();
}

if (authBot) {
    if (links.learn.abIsPrimary()) {
        if (!tags.homeRespawnX) {
            const studio = configBot.tags.studio ?? authBot.id;
            const respawnData = await os.getData(studio, "homeworldRespawnPoint");
            if (respawnData.success) {
                masks.homeRespawnX = respawnData.data.x;
                masks.homeRespawnY = respawnData.data.y;
            }
        }
    }
    
    const homeBots = getBots("abIDOrigin", "home");
    if (homeBots.length == 0) {
        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] no home bots found.`);
        }

        if (links.learn.abIsPrimary()) {
            if (!tags.introPlayed) {
                thisBot.init();
            }
        }
    }

    // Manually call homeworld's onPortalChanged so it sets up the intro state.
    thisBot.onPortalChanged({ portal: 'mapPortal', dimension: 'home' });
}