const todoBot = that;

if (todoBot.tags.abPatchApplied || todoBot.tags.abPatchApplying) {
    if (todoBot.tags.debug) {
        console.log(`[${tags.system}.${tagName}] skipping ${todoBot.tags.system} — applied=${!!todoBot.tags.abPatchApplied} applying=${!!todoBot.tags.abPatchApplying}`);
    }
    return;
}

if (typeof todoBot.abPatchCode === 'function') {
    try {
        if (todoBot.tags.debug) {
            console.log(`[${tags.system}.${tagName}] applying patch on ${todoBot.tags.system} (planId=${todoBot.tags.todoPlanId})`);
        }
        setTag(todoBot, 'abPatchApplying', true);
        const abPatchResults: ABPatchResult[] = await todoBot.abPatchCode();

        if (todoBot.tags.debug) {
            console.log(`[${tags.system}.${tagName}] patch results for ${todoBot.tags.system}:`, abPatchResults);
        }

        // Store the patch results on this patch bot.
        setTag(todoBot, 'abPatchResults', `🧬${JSON.stringify(abPatchResults, undefined, 4)}`);

        // For all patched bots, remove the 'creator' tag on them if the creator was this patch bot.
        // We don't want our patched bots to get destroyed when this patch bot is destroyed.
        for (const result of abPatchResults) {
            const bot = getBot('id', result.botId);

            if (bot && bot.tags.creator === todoBot.id) {
                bot.tags.creator = null;
            }
        }

        setTag(todoBot, 'abPatchApplied', true);
        setTag(todoBot, 'abPatchAppliedTimestamp', os.isCollaborative() ? os.agreedUponTime : os.localTime);

        shout('onAnyABPatchApplied', {
            botId: todoBot.id,
            abPatchCode: todoBot.tags.abPatchCode,
            abPatchAppliedTimestamp: todoBot.tags.abPatchAppliedTimestamp,
            abPatchResults: todoBot.tags.abPatchResults,
        });
    } catch (e) {
        setTag(todoBot, 'animationState', 'error');
        const errorMessage = `Something went wrong applying patch — ${ab.links.utils.getErrorMessage(e)}`;
        if (todoBot.tags.debug) {
            console.log(`[${tags.system}.${tagName}] patch threw on ${todoBot.tags.system}: ${errorMessage}`);
        }
        ab.links.utils.abLogAndToast({ name: todoBot.tags.patchLabel, message: errorMessage, logType: 'error', space: 'shared' });
        setTag(todoBot, 'abPatchError', errorMessage);
    } finally {
        setTag(todoBot, 'abPatchApplying', null);

        if (!todoBot.tags.abPatchResults || !todoBot.tags.abPatchApplied) {
            // If patch is not applied or results are not successfully recorded, then we mark this patch as invalid.
            if (todoBot.tags.debug) {
                console.log(`[${tags.system}.${tagName}] marking patch invalid on ${todoBot.tags.system}`);
            }
            setTag(todoBot, 'abPatchInvalid', true);

            setTag(todoBot, 'animationState', 'error');

            shout('onAnyABPatchFailed', {
                botId: todoBot.id,
                abPatchCode: todoBot.tags.abPatchCode
            });
        }
    }
} else {
    setTag(todoBot, 'animationState', 'error');

    const errorMessage = `Patch code is not a valid function.`;
    ab.links.utils.abLogAndToast({ name: todoBot.tags.patchLabel, message: errorMessage, logType: 'error', space: 'shared' });
    setTag(todoBot, 'abPatchInvalid', true);
    setTag(todoBot, 'abPatchError', errorMessage);
}
