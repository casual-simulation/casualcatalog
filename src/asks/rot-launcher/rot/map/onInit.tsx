if ( masks.initialized ) { return } // Already initialized
if (!configBot) { // Make sure configBot exists
    os.sleep(500).then(() => {
        whisper(thisBot, 'onInit');
    })
    return;
}

if ( configBot.tags.sheetPortal ) { return } // In sheet or system portal
if ( configBot.tags.systemPortal ) { return }

// Avoid re-initialization
masks.initialized = true;

// Go to map portal
mapPortalBot.tags.mapPortalBasemap = 'topo-vector';
configBot.tags.gridPortal = null;
configBot.tags.mapPortal = 'map';
gridPortalBot.tags.portalPannable = false;