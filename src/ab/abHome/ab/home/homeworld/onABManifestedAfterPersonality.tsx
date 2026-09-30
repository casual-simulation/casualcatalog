if (!authBot) {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] no auth bot found.`);
    }
    return;
}

const homeBots = getBots("abIDOrigin", "home");
if (homeBots.length == 0) {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] no home bots found.`);
    }
    // masks.introPlayed = null;
    // await os.sleep(0);

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

            if (!tags.introPlayed) {
                // setTagMask(links.remember, "mapPreventFocus", true);
                thisBot.init();
            }
        } else {
            ab.links.manifestation.abSetAwake({ awake: false });
        }
    } 
}