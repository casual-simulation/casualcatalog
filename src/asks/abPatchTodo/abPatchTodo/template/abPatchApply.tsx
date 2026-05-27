if (tags.abPatchApplied || tags.abPatchApplying) {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] skipping — applied=${!!tags.abPatchApplied} applying=${!!tags.abPatchApplying}`);
    }
    return;
}

if (typeof thisBot.abPatchCode === 'function') {
    try {
        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] applying patch on ${thisBot.id} (planId=${tags.todoPlanId})`);
        }
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

        shout('onAnyABPatchApplied', { 
            botId: thisBot.id,
            abPatchCode: tags.abPatchCode,
            abPatchAppliedTimestamp: tags.abPatchAppliedTimestamp,
            abPatchResults: tags.abPatchResults,
        });
    } catch (e) {
        tags.animationState = 'error';
        const errorMessage = `Something went wrong applying patch — ${ab.links.utils.getErrorMessage(e)}`;
        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] patch threw on ${thisBot.id}: ${errorMessage}`);
        }
        ab.links.utils.abLogAndToast({ name: tags.patchLabel, message: errorMessage, logType: 'error', space: 'shared' });
        tags.abPatchError = errorMessage;
    } finally {
        tags.abPatchApplying = null;

        if (!tags.abPatchResults || !tags.abPatchApplied) {
            // If patch is not applied or results are not successfully recorded, then we mark this patch as invalid.
            if (tags.debug) {
                console.log(`[${tags.system}.${tagName}] marking patch invalid on ${thisBot.id}`);
            }
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
    ab.links.utils.abLogAndToast({ name: tags.patchLabel, message: errorMessage, logType: 'error', space: 'shared' });
    tags.abPatchInvalid = true;
    tags.abPatchError = errorMessage;
}