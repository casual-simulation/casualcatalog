const allTargetBots = Array.isArray(links.remember.links.abMultipleBotFocus) ? links.remember.links.abMultipleBotFocus : [links.remember.links.abMultipleBotFocus];
const builder = ab.links.manifestation.links.abBot ? ab.links.manifestation.links.abBot.id : null;
const relevantTargetBots = allTargetBots.filter((target) => target.id != builder);

destroy(relevantTargetBots);

ab.links.sound.abPlaySound({ value: ab.links.sound.tags.defaultDestroySound });

shout("abMenuRefresh");

links.manifestation.abClick({ reset: true });