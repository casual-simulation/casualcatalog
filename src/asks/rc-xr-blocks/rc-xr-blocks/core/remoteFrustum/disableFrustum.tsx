// [Ryan] Need to include same sleep time as enableFrustum to ensure it runs in
// the same order if both are called.
await os.sleep(500);

// Destroy previous frustum if it exists.
if (masks.frustumBotId) {
    console.log(`[remoteFrustum] disable frustum`);
    destroy(getBot('id', masks.frustumBotId));
    masks.frustumBotId = null;
}