console.log(`[${tags.system}.${tagName}] that:`, that);

const { photo } = that;

const inXR = configBot.tags.inAR || configBot.tags.inVR || tags.testXR;

masks.cameraState = 'captured';
masks.busy = null;
masks.label = null;

os.playSound(tags.shutterUrl);

if (inXR) {

} else {
    os.closePhotoCamera();
}

const arrayBuffer = await photo.data.arrayBuffer();

// convert photo data structure into a file data structure accepted by requestMediaUpload.
const file = {
    name: `${uuid()}.png`,
    data: arrayBuffer,
    size: photo.data.size,
    mimeType: photo.data.type,
}

console.log(`[${tags.system}.${tagName}] file:`, file);

links.mediaUpload.requestMediaUpload(file);