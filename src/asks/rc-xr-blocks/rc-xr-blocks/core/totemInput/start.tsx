if (tags.enabled) {
    thisBot.stop();
}

masks.enabled = true;
gridPortalBot.tags.portalPannable = false;
gridPortalBot.tags.portalRotatable = false;

const dim = 'home';

// Setup totem bots.
let mod = {
    space: 'tempLocal',
    isSet: false,
    [dim]: false,
    [`${dim}X`]: 0,
    [`${dim}Y`]: 0,
    [`${dim}Z`]: 0,
    color: '#f00',
    scaleY: 0.5,
    scaleX: 0.5,
    scaleZ: 2,
    draggable: false,
}

masks.totemA = create(mod).link;
masks.totemB = create(mod).link;

masks.intervalId = setInterval(thisBot.onUpdate, 100);
masks.pointerDown = null;

os.toast('Totem calibration started. Tap/Click on ground to place totems.', 4);

shout('onTotemSetupStarted');

return [links.totemA, links.totemB];