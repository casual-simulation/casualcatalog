const allTargetBots = Array.isArray(ab.links.remember.links.abMultipleBotFocus) ? ab.links.remember.links.abMultipleBotFocus : [ab.links.remember.links.abMultipleBotFocus];
const builder = ab.links.manifestation.links.abBot ? ab.links.manifestation.links.abBot.id : null;
const relevantTargetBots = allTargetBots.filter((target) => target.id != builder);

destroy(relevantTargetBots);

ab.links.sound.abPlaySound({ value: ab.links.sound.tags.defaultDestroySound });

shout("abMenuRefresh");

ab.links.manifestation.abClick({ reset: true });