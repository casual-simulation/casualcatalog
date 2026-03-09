const { bot, dimension, modality, hand } = that;

if (bot.tags.teleXRLaserPointable) {
    masks.pointing = '🧬' + JSON.stringify({
        botId: bot.id,
        dimension,
        modality,
        hand
    })

    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] set pointing:`, tags.pointing);
    }
}