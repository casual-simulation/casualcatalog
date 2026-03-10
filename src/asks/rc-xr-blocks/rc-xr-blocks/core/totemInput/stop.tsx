if (!tags.enabled) {
    return;
}

gridPortalBot.tags.portalPannable = true;
gridPortalBot.tags.portalRotatable = true;

clearInterval(masks.intervalId);
masks.pointerDown = null;

destroy(links.totemA);
masks.totemA = null;

destroy(links.totemB);
masks.totemB = null;

masks.totemToSet = null;
masks.enabled = null;

shout('onTotemSetupStopped');