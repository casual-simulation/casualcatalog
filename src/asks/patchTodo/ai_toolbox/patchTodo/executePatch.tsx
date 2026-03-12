try {
    thisBot.handleAnimationState("processing");
   
    await thisBot.abPatchApply();
} finally {
    thisBot.updatePatchColor();
}

await os.sleep(0); // NOTE: Need to wait 1 frame and let tags/masks updates in the patch bots otherwise the menu wont be able to retrieve all patch bots successfully.

if (tags.alwaysApprove && tags.abPatchApplied) {
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