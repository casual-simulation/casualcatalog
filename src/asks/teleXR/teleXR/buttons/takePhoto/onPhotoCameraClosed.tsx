console.log(`[${tags.system}.${tagName}] that:`, that);

const inXR = configBot.tags.inAR || configBot.tags.inVR || tags.testXR;

if (tags.cameraState === 'opened') {
    // User closed the photo camera early, thus canceling it.
    masks.busy = null;
    masks.label = null;
}

masks.cameraState = 'closed';
