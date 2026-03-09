if (!globalThis.mainSceneBot) {
    console.error('Compass calibration needs mainSceneBot to be loaded.');
    return;
}

const dim = os.getCurrentDimension();
const camPos = os.getCameraPosition('grid');

mainSceneBot.tags[`${dim}X`] = camPos.x;
mainSceneBot.tags[`${dim}Y`] = camPos.y;

const camRot = os.getCameraRotation('grid');
mainSceneBot.tags[`${dim}RotationZ`] = camRot.z;