// superShout("instCheckin", configBot.tags);
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