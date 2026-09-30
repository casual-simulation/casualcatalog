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
            if (!tags.introPlayed) {
                // setTagMask(links.remember, "mapPreventFocus", true);
                thisBot.init();
            }
        }
    } 
}