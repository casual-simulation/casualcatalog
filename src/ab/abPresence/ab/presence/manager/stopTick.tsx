if (masks.tickIntervalId) {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] stop interval`);
    }

    clearInterval(masks.tickIntervalId);
    masks.tickIntervalId = null;
}