let previousFrustumBot = masks.frustumBotId ? getBot('id', masks.frustumBotId) : null;
if (previousFrustumBot) {
    // Frustum bot is already active.
    return;
}

console.log(`[remoteFrustum] enable frustum`);

// [Ryan] For some reason waiting half a second here fixes a bug
// that causes AUX to put the first user's frustum in the "shared" space.
await os.sleep(500);

const dim = tags.mainSceneDimension;
const frustumMod = {};

frustumMod.space = "tempShared";
frustumMod.fmfrustum = true;
frustumMod.frustumID = configBot.id;
frustumMod.form = "frustum";
frustumMod.pointable = false;
frustumMod.mainSceneDimension = tags.mainSceneDimension;
frustumMod.currentDimension = dim;

frustumMod[dim] = true;
frustumMod[dim+"Rotation"] = `🔁0,0,0,1`;
frustumMod[dim+"X"] = gridPortalBot.tags.cameraPositionX;
frustumMod[dim+"Y"] = gridPortalBot.tags.cameraPositionY;
frustumMod[dim+"Z"] = gridPortalBot.tags.cameraPositionZ;
frustumMod.updateRateMS = tags.__updateRateMS;
frustumMod.onCreate = tags.__onCreate;
frustumMod.onDestroy = tags.__onDestroy;
frustumMod.frustumUpdate = tags.__frustumUpdate;
frustumMod.onPortalChanged = tags.__onPortalChanged;

const frustumBot = create(frustumMod);

// Store id of frustum bot locally, so that we may destroy it later if needed.
masks.frustumBotId = frustumBot.id;

// Make invisible to local user.
frustumBot.masks.form = 'none';
frustumBot.masks.color = 'clear';