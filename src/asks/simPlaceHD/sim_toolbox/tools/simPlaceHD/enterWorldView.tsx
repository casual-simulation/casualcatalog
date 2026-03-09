tags.savedPortalColor = gridPortalBot.tags.portalColor || '#263238';
tags.savedSurfaceScale = gridPortalBot.tags.portalSurfaceScale;

links.shell.cmdABSleep();

gridPortalBot.tags.portalColor = '#000000';
// gridPortalBot.tags.portalSurfaceScale = 0;

const inXR = configBot.tags.arEnabled || configBot.tags.vrEnabled;
if (!inXR) {
   os.enablePointOfView({ x: 0, y: 0, z: 0 }); 
}
