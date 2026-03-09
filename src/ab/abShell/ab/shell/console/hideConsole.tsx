var currentVer = masks.consoleVersion ?? 0;
await os.unregisterApp(`ab-console-${currentVer}`);
masks.open = false;
gridPortalBot.masks.portalZoomable = null;