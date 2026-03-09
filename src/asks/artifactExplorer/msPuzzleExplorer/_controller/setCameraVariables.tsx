let {
    skipWait = false,
    xPos = 0.5,
    yPos = -1.25,
    zoom = 18
} = that || {};

if (skipWait != true) { await os.sleep(1000); }

let waitLimit = 0;
while (!gridPortalBot?.tags?.pixelHeight || !gridPortalBot?.tags?.pixelWidth) {
    if (waitLimit > 99) {
        break;
    }

    console.log("screen size not found, waiting for gridPortalBot to populate");
    waitLimit++;
    await os.sleep(100);
}

let offset = await thisBot.getOffset();
let meshBots = false;

getBots(b => {
    if (b.tags.tileProperties && b.tags.form == "mesh") {
        meshBots = true;
    }
})

if (!that?.zoom) {
    let sW = gridPortalBot.tags.pixelWidth; // screen width
    let sH = gridPortalBot.tags.pixelHeight; // screen height
    let sR = sW / sH; // screen ratio of width to height
    const a = -1.9 * 10 ** -5; // prevents the zoom from growing too fast as the width of the device increases
    const b = 3.8 * 10 ** -2; // increases the zoom as the width of the device increases
    const c = 4.6 * 10 ** -1; // the baseline zoom amount
    const d = sR > 0.5 ? 5 * sR ** 2 : 0; // modifier that increases the zoom for screens with heights closer to their widths
    let widthZoom = a * sW ** 2 + b * sW + c + d;
    let heightZoom = 19;

    zoom = widthZoom < heightZoom ? widthZoom : heightZoom;
}

await os.focusOn({
    x: xPos + offset.x,
    y: yPos + offset.y
}, {
    rotation: {
        x: 0,
        y: 0
    },
    duration: 0.5,
    easing: "linear"
    // zoom: zoom
});

// console.log("zoom coords: ", gridPortalBot.tags.cameraZoom);
let xBound = new Vector3(-4, 0, 0);
let yBound = new Vector3(0, 5.5, 0);

let coordX = await os.calculateScreenCoordinatesFromPosition('grid', xBound);
let coordY = await os.calculateScreenCoordinatesFromPosition('grid', yBound);
coordX = coordX.x;
coordY = coordY.y;
// console.log(`coords - x: ${coordX}, y: ${coordY}`);

let coordCheck = coordX > coordY ? coordY : coordX;
let zoomStep = 0.5;
let zoomSpeed = 0.025;

while (Math.abs(coordCheck) > 10) {

    await os.focusOn({
        x: xPos + offset.x,
        y: yPos + offset.y
    }, {
        duration: zoomSpeed,
        easing: "linear",
        zoom: coordCheck > 0 ? gridPortalBot.tags.cameraZoom + zoomStep : gridPortalBot.tags.cameraZoom - zoomStep
    });

    let tempCoordX = await os.calculateScreenCoordinatesFromPosition('grid', xBound);
    let tempCoordY = await os.calculateScreenCoordinatesFromPosition('grid', yBound);
    coordX = tempCoordX.x;
    coordY = tempCoordY.y;
    // console.log(`coords - x: ${coordX}, y: ${coordY}`);
    coordCheck = coordX > coordY ? coordY : coordX;
}

// console.log(`coords - x: ${coordX}, y: ${coordY}`);



if (!meshBots) {
    gridPortalBot.tags.portalRotatable = false;
    // gridPortalBot.tags.portalPannable = false;
    gridPortalBot.tags.portalPannableMaxX = 20 + offset.x;
    gridPortalBot.tags.portalPannableMaxY = 20 + offset.y;
    gridPortalBot.tags.portalPannableMinX = -20 + offset.x;
    gridPortalBot.tags.portalPannableMinY = -20 + offset.y;
    gridPortalBot.tags.portalZoomableMax = 30;
    gridPortalBot.tags.portalZoomableMin = 10;
}
else {
    gridPortalBot.tags.portalRotatable = true;
    gridPortalBot.tags.portalPannableMaxX = 20 + offset.x;
    gridPortalBot.tags.portalPannableMaxY = 20 + offset.y;
    gridPortalBot.tags.portalPannableMinX = -20 + offset.x;
    gridPortalBot.tags.portalPannableMinY = -20 + offset.y;
    gridPortalBot.tags.portalZoomableMax = 30;
    gridPortalBot.tags.portalZoomableMin = 10;
}