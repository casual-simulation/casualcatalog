// superShout("instCheckin", configBot.tags);
//Check login
if (!authBot) {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] authBot not found`);
    }
    masks.awaitingAuthBot = true;
    await os.requestAuthBot();

    masks.awaitingAuthBot = null;
}

if (!authBot) {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] User not logged in.`);
    }
    return;
}

configBot.tags.abStayAwake = null;
os.syncConfigBotTagsToURL(["abStayAwake"]);

if (links.learn.abIsPrimary()) {
    if (!tags.homeRespawnX) {
        const studio = configBot.tags.studio ?? authBot.id;
        const respawnData = await os.getData(studio, "homeworldRespawnPoint");
        if (respawnData.success) {
            masks.homeRespawnX = respawnData.data.x;
            masks.homeRespawnY = respawnData.data.y;
        }
    }

    if (!tags.introPlayed) {
        setTagMask(links.remember, "mapPreventFocus", true);
        thisBot.init();
    }
} else {
    ab.links.manifestation.abSetAwake({ awake: false });
}