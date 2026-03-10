const targetBot = that.bot.links.targetBot;

if (that.bot.links.targetOriginBots) {
    // Destroy bots belonging to abIDOrigin.
    destroy(that.bot.links.targetOriginBots);
} else {
    // Destroy the single target bot.
    destroy(targetBot);
}

ab.links.sound.abPlaySound({ value: ab.links.sound.tags.defaultDestroySound });

shout("abMenuRefresh");

links.manifestation.abClick({ reset: true });