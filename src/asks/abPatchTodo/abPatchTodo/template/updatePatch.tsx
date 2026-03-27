const patchCode = that.patchCode;

tags.abPatchCode = `@${patchCode}`;
thisBot.changeAnimationState('processing_in');
thisBot.executePatch();
