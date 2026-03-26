// Need to reimplement try again functionaltiy, its much more complex now that todo bots could be part of a larger plan.
// Its possible that we would need to undo any patches on todo bots that are in the plan after this one.
// Also blindly calling askGPT will result in the ab bot taking over when we actually want the agent bot to try again.
console.warn('TODO: need to reimplement try again functionality.');

// if (tags.abPatchInvalid) {
//     destroy(thisBot);
// } else {
//     whisper(thisBot, 'onABPatchUndoClick');
// }

// ab.links.ask.askGPT(askInput);
