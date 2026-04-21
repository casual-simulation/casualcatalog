whisper(thisBot, 'abPatchUndo', { keepBot: true });

setTag(thisBot, 'abPatchCode', null);
setTag(thisBot, 'abPatchApplied', null);
setTag(thisBot, 'abPatchAppliedTimestamp', null);
setTag(thisBot, 'abPatchInvalid', null);
setTag(thisBot, 'abPatchApplying', null);
setTag(thisBot, 'abPatchResults', null);
setTag(thisBot, 'abPatchError', null);
setTag(thisBot, 'abTodoComplete', null);
setTag(thisBot, 'creditSnapshotStart', null);
setTag(thisBot, 'creditSnapshotEnd', null);

tags.animationState = 'incomplete';
