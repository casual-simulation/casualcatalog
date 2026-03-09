const { bot, dimension, modality, hand } = that;

if (bot.tags.teleXRLaserPointable) {
    if (masks.pointing && masks.pointing.botId === bot.id) {
        masks.pointing = null;

        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] removed pointing:`, tags.pointing);
        }
    }
}