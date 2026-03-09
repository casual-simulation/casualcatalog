// Don't track if no record
if (!tags.stickyRecord) { return }

// Don't update for masks
if (masks) {
    if (Object.keys(masks).some(m => that.tags.indexOf(m) >= 0)) {
        return
    }
}

// Don't update unstored tags
if (tags.unstoredTags.some(m => that.tags.indexOf(m) >= 0)) {
    return
}

// Clear previous timer
if (thisBot.vars.cancelTimeout) {
    clearTimeout(thisBot.vars.cancelTimeout);
}

// Start 5s timer to update
thisBot.vars.cancelTimeout = setTimeout(() => {
    thisBot.vars.cancelTimeout = null;
    whisper(thisBot, "handleUpdate");
}, 5000);