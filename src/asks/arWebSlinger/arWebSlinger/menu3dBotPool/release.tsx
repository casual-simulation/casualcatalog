if (!masks.initialized) {
    return;
}

const menu3dBot = that;

assert(menu3dBot && menu3dBot.id && menu3dBot.tags, `[${tags.system}.${tagName}] must be given a Bot`);

if (!menu3dBot.tags.inPool) {
    whisper(menu3dBot, 'onReleasedToPool');

    thisBot.vars.pool.push(menu3dBot);

    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] released to pool (${thisBot.vars.pool.length}):`, menu3dBot);
    }
} else {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] already in pool:`, menu3dBot);
    }
}
