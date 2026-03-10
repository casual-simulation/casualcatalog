if (masks.initialized) {
    return;
}

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] invoke`);
}

masks.initialized = true;

await links.menu3dBotPool.initialize();

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] going to refresh menu 3d portal because the menu 3d portal has been initialized.`);
}

thisBot.refreshPortal();