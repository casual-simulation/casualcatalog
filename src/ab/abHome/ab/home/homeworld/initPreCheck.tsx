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