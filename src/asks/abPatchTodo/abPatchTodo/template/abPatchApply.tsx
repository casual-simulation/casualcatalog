if (tags.abPatchApplied || tags.abPatchApplying) {
    return;
}

if (typeof thisBot.abPatchCode === 'function') {
    try {
        tags.abPatchApplying = true;
        const abPatchResults: ABPatchResult[] = await thisBot.abPatchCode();

        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] patch results:`, abPatchResults);
        }

        // Store the patch results on this patch bot.
        tags.abPatchResults = `🧬${JSON.stringify(abPatchResults, undefined, 4)}`;

        // For all patched bots, remove the 'creator' tag on them if the creator was this patch bot.
        // We don't want our patched bots to get destroyed when this patch bot is destroyed.
        for (const result of abPatchResults) {
            const bot = getBot('id', result.botId);
            
            if (bot && bot.tags.creator === thisBot.id) {
                bot.tags.creator = null;
            }
        }

        tags.abPatchApplied = true;
        tags.abPatchAppliedTimestamp = os.isCollaborative() ? os.agreedUponTime : os.localTime;
        tags.abTodoComplete = true;

        tags.animationState = 'complete';

        shout('onAnyABPatchApplied', { 
            botId: thisBot.id,
            abPatchCode: tags.abPatchCode,
            abPatchAppliedTimestamp: tags.abPatchAppliedTimestamp,
            abPatchResults: tags.abPatchResults,
        });
    } catch (e) {
        tags.animationState = 'error';
        const errorMessage = `Something went wrong applying patch — ${ab.links.utils.getErrorMessage(e)}`;
        ab.links.utils.abLogAndToast({ name: tags.patchLabel, message: errorMessage, logType: 'error' });
        tags.abPatchError = errorMessage;
    } finally {
        tags.abPatchApplying = null;

        if (!tags.abPatchResults || !tags.abPatchApplied) {
            // If patch is not applied or results are not successfully recorded, then we mark this patch as invalid.
            tags.abPatchInvalid = true;

            tags.animationState = 'error';

            shout('onAnyABPatchFailed', { 
                botId: thisBot.id,
                abPatchCode: tags.abPatchCode
            });
        }
    }
} else {
    tags.animationState = 'error';

    const errorMessage = `Patch code is not a valid function.`;
    ab.links.utils.abLogAndToast({ name: tags.patchLabel, message: errorMessage, logType: 'error' });
    tags.abPatchInvalid = true;
    tags.abPatchError = errorMessage;
}