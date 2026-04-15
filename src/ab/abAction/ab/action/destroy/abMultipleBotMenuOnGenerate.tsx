const allTargetBots = Array.isArray(ab.links.remember.links.abMultipleBotFocus) ? ab.links.remember.links.abMultipleBotFocus : [ab.links.remember.links.abMultipleBotFocus];
const builder = ab.links.manifestation.links.abBot ? ab.links.manifestation.links.abBot.id : null;
const relevantTargetBots = allTargetBots.filter((target) => target.id != builder);

if (relevantTargetBots.length > 1) {
    // Multiple bots.
    tags.label = `destroy (${relevantTargetBots.length} bots)`;
} else if (relevantTargetBots.length === 1) {
    // Single bot.
    tags.label = `destroy`;
} else {
    // No bots to destroy.
    destroy(thisBot);
}