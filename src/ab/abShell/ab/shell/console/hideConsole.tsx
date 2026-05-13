var currentVer = masks.consoleVersion ?? 0;
await os.unregisterApp(`ab-console-${currentVer}`);
setTagMask(thisBot, 'open', false, 'local');
gridPortalBot.masks.portalZoomable = null;