const PANNABLE_AREA_SIZE = 12;

gridPortalBot.masks.portalPannableMin = `➡️${-PANNABLE_AREA_SIZE},${-PANNABLE_AREA_SIZE}`;
gridPortalBot.masks.portalPannableMax = `➡️${PANNABLE_AREA_SIZE},${PANNABLE_AREA_SIZE}`;
gridPortalBot.masks.portalZoomableMin = 8;
gridPortalBot.masks.portalZoomableMax = 600;
// gridPor
gridPortalBot.masks.portalColor = "#0c254e";

configBot.tags.leftWristPortal = 'leftWrist';

leftWristPortalBot.tags.portalGridScale = 0.025;

// Focus gridPortal camera on buttons.
await os.sleep(750);
os.focusOn({ x: -4, y: 0, z: 0 }, { zoom: 25, rotation: { x: 0.5, y: 0.2 }}).catch(() => {});