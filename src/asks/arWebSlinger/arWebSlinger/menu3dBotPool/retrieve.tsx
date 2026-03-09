if (!masks.initialized) {
    return;
}

let menu3dBot;

if (thisBot.vars.pool && thisBot.vars.pool.length > 0) {
    menu3dBot = thisBot.vars.pool.pop();

    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] retrieved from pool (${thisBot.vars.pool.length}):`, menu3dBot);
    }
} else {
    menu3dBot = thisBot._newMenu3dBot();

    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] pool is empty, created new:`, menu3dBot);
    }
}

whisper(menu3dBot, 'onRetrievedFromPool');
return menu3dBot;