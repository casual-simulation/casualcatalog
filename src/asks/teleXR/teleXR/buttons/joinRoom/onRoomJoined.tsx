console.log(`[${tags.system}.${tagName}] that:`, that);
masks.buttons = false;

const inXR = configBot.tags.inAR || configBot.tags.inVR;

if (!inXR) {
    os.focusOn({ x: 0, y: -1, z: 0 }, { zoom: 18, rotation: { x: 1, y: 0.75 }}).catch(() => {});
}