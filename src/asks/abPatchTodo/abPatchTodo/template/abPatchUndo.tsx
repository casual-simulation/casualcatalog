if (!tags.abPatchApplied || tags.abPatchApplying) {
    return;
}

const abPatchResults: ABPatchResult[] = tags.abPatchResults;

if (abPatchResults && abPatchResults.length > 0) {
    for (let result of abPatchResults) {
        const patchedBot = getBot('id', result.botId);

        if (patchedBot) {
            if (result.created) {
                // This patch created the bot, to undo it we destroy it.
                destroy(patchedBot);
                if (!that?.keepBot) destroy(thisBot);
            } else if (result.rollbackDiff) {
                // This patch modified the bot, to undo it we apply all the the tags and masks in the rollback diff to the bot.
                const rollbackBotData = result.rollbackDiff[patchedBot.id];
                const rollbackTags = rollbackBotData.tags;
                const rollbackMasks = rollbackBotData.masks;

                if (rollbackTags) {
                    for (const tagName in rollbackTags) {
                        setTag(patchedBot, tagName, rollbackTags[tagName]);
                    }
                }

                if (rollbackMasks) {
                    for (const space in rollbackMasks) {
                        if (space === 'remoteTempShared') {
                            // Cant set remoteTempShared masks, they are owned by someone else.
                            continue;
                        }

                        for (const tagName in rollbackMasks[space]) {
                            setTagMask(patchedBot, tagName, rollbackMasks[space][tagName], space);
                        }
                    }
                }

                // After tags and masks have been rolled back, destroy this patch bot.
                if (!that?.keepBot) destroy(thisBot);
            } else {
                ab.links.utils.abLogAndToast({ message: `Cannot undo ${tags.system}. Something went wrong during patch process? No data found to undo changes.`, logType: 'warning' });
            }
        } else {
            // Patched bot not found, quietly destroy the patch bot.
            if (!that?.keepBot) destroy(thisBot);
        }
    }
}