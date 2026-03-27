thisBot.changeAnimationState("processing_in");

await thisBot.abPatchApply();

await os.sleep(0); // NOTE: Need to wait 1 frame and let tags/masks updates in the patch bots otherwise the menu wont be able to retrieve all patch bots successfully.

if (tags.alwaysApprove && tags.abPatchApplied) {
    thisBot.onABPatchApproveClick();
} else {
    thisBot.abPatchMenuOpen();
}