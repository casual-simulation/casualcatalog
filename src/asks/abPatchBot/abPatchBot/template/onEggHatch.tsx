if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] that:`, that);
}

const sourceEvent = that?.sourceEvent;

if (sourceEvent === 'ask_gpt') {
    const patchCode = that.eggParameters.patchCode;
    const askInput = that.eggParameters.askInput;
    const dimension = that.eggParameters.dimension;
    const position = that.eggParameters.position;
    const alwaysApprove = that.eggParameters.alwaysApprove ?? false;

    tags.abIgnore = true;
    tags.abPatchBotInstance = true;
    tags.abPatchAskInput = `🧬${JSON.stringify(askInput)}`;
    tags.abPatchCode = `@${patchCode}`;
    tags.abPatchBotIdentity = `patch ${thisBot.id.substring(0, 5)}`;
    tags.abPatchLabel = `review ${tags.abPatchBotIdentity}`;
    tags.system = `abPatchBot.${tags.abPatchBotIdentity}`;
    tags[dimension] = true;
    tags[dimension + 'X'] = position?.x ?? 0;
    tags[dimension + 'Y'] = position?.y ?? 0;
    tags[dimension + 'Z'] = position?.z ?? 0;

    try {
        await thisBot.abPatchApply();
    } finally {
        thisBot.updatePatchColor();
    }

    await os.sleep(0); // NOTE: Need to wait 1 frame and let tags/masks updates in the patch bots otherwise the menu wont be able to retrieve all patch bots successfully.

    if (alwaysApprove && tags.abPatchApplied) {
        thisBot.onABPatchApproveClick();
    } else {
        // const abBot = ab.links.manifestation.links.abBot;
        // if (abBot) {
        //     const abBotPosition = getBotPosition(abBot, dimension);
        //     if (abBotPosition.x == position.x && 
        //         abBotPosition.y == position.y &&
        //         abBotPosition.z == position.z
        //     ) {
        //         if (!configBot.tags.abStayAwake) {
        //             // If the ab bot is in the current position of this patch bot, hide the ab bot.
        //             destroy(ab.links.manifestation.links.abBot);
        //         }

        //         // If the ab bot didn't move, automatically open the menu for this new patch bot.
        //     }
        // }

        thisBot.abPatchMenuOpen();
    }
}
