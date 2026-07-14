// superShout("instCheckin", configBot.tags);
configBot.tags.abStayAwake = null;
os.syncConfigBotTagsToURL(["abStayAwake"]);

if (links.learn.abIsPrimary()) {
    if (!tags.homeRespawnX) {
        const respawnData = await os.getData(studio, "homeworldRespawnPoint");
        console.log("respawn", respawnData)
        if (respawnData) {
            masks.homeRespawnX = respawnData.x;
            masks.homeRespawnY = respawnData.y;
        }
    }

    if (!tags.introPlayed) {
        setTagMask(links.remember, "mapPreventFocus", true);
        thisBot.init();
    }
} else {
    ab.links.manifestation.abSetAwake({ awake: false });
}