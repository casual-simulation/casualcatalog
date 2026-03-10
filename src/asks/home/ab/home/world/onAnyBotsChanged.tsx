if (!tags.autoSave) {
    return;
}

let validChange = false;

for (const changed of that) {
    if (changed.bot.tags.space !== 'shared') {
        continue;
    }

    if (changed.bot.tags.abIgnore) {
        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] ignore inst change: bot has abIgnore tag.`);
        }
        continue;
    }

    if (!changed.bot.tags.homeWorldBot) {
        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] ignore inst change: bot is not a homeWorldBot.`);
        }
        continue;
    }

    if (changed.bot.tags.system && changed.bot?.tags?.system?.substring(0, 3) == 'ab.') {
        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] ignore inst change: bot is an ab bot.`);
        }
        continue;
    }

    if (changed.tags.some(t => t === 'abArtifactBundle' || t === 'abArtifactInstanceID' || t === 'abArtifactShardInstanceID')) {
        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] ignore inst change: bot's changed tags are related to artifacts.`);
        }
        continue;
    }
    
    validChange = true;
    break;
}

if (validChange) {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] process inst change.`);
    }
    thisBot.processInstChange();
}