if (!tags.autoSave) {
    return;
}

let validChange = false;
for (const addedBot of that.bots) {
    if (addedBot.tags.space !== 'shared') {
        continue;
    }

    if (addedBot.tags.abIgnore) {
        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] ignore inst change: bot has abIgnore tag.`);
        }
        continue;
    }

    if (addedBot.tags.system && addedBot.tags.system.substring(0, 3) == 'ab.') {
        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] ignore inst change: bot is an ab bot.`);
        }
        continue;
    }

    if (!addedBot.tags.homeWorldBot) {
        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] ignore inst change: bot is not a homeWorldBot.`);
        }
        continue;
    }

    if (addedBot.tags.abIDOrigin && addedBot.tags.abIDOrigin == 'home') {
        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] ignore inst change: bot is from the home egg.`);
        }
        continue;
    }

    //Add homeWorldBot if needed.
    if (!thisBot.vars.homeWorldBotIDs) {
        thisBot.vars.homeWorldBotIDs = new Set();
    }

    if (!thisBot.vars.homeWorldBotIDs.has(addedBot.id)) {
        thisBot.vars.homeWorldBotIDs.add(addedBot.id);
    }

    validChange = true;
}

if (validChange) {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] process inst change.`);
    }
    thisBot.processInstChange();
}