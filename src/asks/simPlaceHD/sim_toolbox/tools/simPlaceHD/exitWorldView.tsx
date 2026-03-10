const inXR = configBot.tags.arEnabled || configBot.tags.vrEnabled;
if (!inXR) {
   os.disablePointOfView(); 
}

links.shell.cmdABWake();

gridPortalBot.tags.portalColor = tags.savedPortalColor || '#263238';
// gridPortalBot.tags.portalSurfaceScale = tags.savedSurfaceScale || 2;