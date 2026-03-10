const aux = that?.aux;
const groupTag = that?.groupTag;
const dryRun = that?.dryRun ?? false;

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] that:`, that);
}

assert(aux?.version === 2, `[${tags.system}.${tagName}] aux parameter is required to be a v2 aux file.`);
assert(groupTag == null || typeof groupTag === 'string', `[${tags.system}.${tagName}] groupTag parameter if provided, must be a string.`);

const state = await os.getInstStateFromUpdates(aux.updates);

// Super hardcoded messy fix for computing abConfig source hash.
if (groupTag === 'abConfig') { 
    for (let id in state) {
        delete state[id].tags.baseAB; // baseAB is an annoying tag that should not be computed as part of hash state.
    }
}

let sourceHash = crypto.hash('sha1', 'hex', state);
let prevGroupBots = getBots(b => b.tags[groupTag] === true);

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] state:`, state);
    console.log(`[${tags.system}.${tagName}] prevGroupBots:`, prevGroupBots);
}

// Step 1: Apply updates directly to the inst as-is.
if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] Step 1: Apply updates directly to the inst as-is.`);
}

if (!dryRun) {
    await os.applyUpdatesToInst(aux.updates);
} else {
    console.log(`[${tags.system}.${tagName}] dry run: would apply updates to inst.`)
}

// Step 2: Delete previous group bots that are no longer in the update state.
if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] Step 2: Delete previous group bots that are no longer in the update state.`);
}

for (const prevGroupBot of prevGroupBots) {
    if (state[prevGroupBot.id] == null) {
        if (dryRun) {
            console.log(`[${tags.system}.${tagName}] dry run: would delete bot ${prevGroupBot.id} previously belonging to group ${groupTag}`);
            continue;
        }

        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] destroying previous group bot ${prevGroupBot.id} that is no longer in the update state.`);
        }

        destroy(prevGroupBot);
    }
}

// Step 3: For each bot in the update state, create, update, and delete tags on the existing bots in the inst.
if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] Step 3: For each bot in the update state, create, update, and delete tags on the existing bots in the inst.`);
}

for (const botId in state) {
    const bot = getBot('id', botId);
    const botState = state[botId];

    if (bot) {
        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] found existing bot ${botId}`);
        }

        // Handles tag create / update.
        for (const stateTagName in botState.tags) {
            if (bot.raw[stateTagName] != botState.tags[stateTagName]) {
                if (dryRun) {
                    console.log(`[${tags.system}.${tagName}] dry run: would set tag '${stateTagName}' on bot ${botId} to value:`, botState.tags[stateTagName]);
                    continue;
                }

                if (tags.debug) {
                    console.log(`[${tags.system}.${tagName}] set tag '${stateTagName}' on bot ${botId} to:`, botState.tags[stateTagName]);
                }

                bot.tags[stateTagName] = botState.tags[stateTagName];

                if (botState.tags[stateTagName] == null) {
                    if (tags.debug) {
                        console.log(`[${tags.system}.${tagName}] tag '${stateTagName}' for bot ${botId} is null, clearing any tag masks as well.`);
                    }

                    // Clear all possible masks for this tag as well.
                    setTagMask(bot, stateTagName, null, 'local');
                    setTagMask(bot, stateTagName, null, 'tempLocal');
                    setTagMask(bot, stateTagName, null, 'shared');
                    setTagMask(bot, stateTagName, null, 'tempShared');
                }
            } else {
                if (tags.debug) {
                    console.log(`[${tags.system}.${tagName}] tag '${stateTagName}' for bot ${botId} is already up-to-date.`);
                }
            }
        }

        // Delete tags (and masks for those tags) on existing bot that are not in update state.
        const botTags = Object.keys(bot.tags);

        for (const botTagName of botTags) {
            if (botState.tags[botTagName] == null) {
                if (dryRun) {
                    console.log(`[${tags.system}.${tagName}] dry run: would delete tag '${botTagName}' on bot ${botId}.`);
                    continue;
                }

                if (tags.debug) {
                    console.log(`[${tags.system}.${tagName}] delete tag (and masks) '${botTagName}' on bot ${botId}.`);
                }

                bot.tags[botTagName] = null;
                // Clear all possible masks for this tag as well.
                setTagMask(bot, botTagName, null, 'local');
                setTagMask(bot, botTagName, null, 'tempLocal');
                setTagMask(bot, botTagName, null, 'shared');
                setTagMask(bot, botTagName, null, 'tempShared');
            }
        }
    } else {
        console.error(`[${tags.system}.${tagName}] could not find bot ${botId} in inst.`);
    }
}

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] done.`);
}

const botIds = Object.keys(state);

return {
    groupTag,
    botIds,
    sourceHash,
};