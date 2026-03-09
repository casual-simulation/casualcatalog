if (masks.initialized) {
    return;
}

// Initialize the pool.
thisBot.vars.pool = [];

masks.initialized = true;

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] invoke`);
}

for (let i = 0; i < tags.startSize; i++) {
    const menu3dBot = thisBot.retrieve();
    thisBot.release(menu3dBot);
}
