
if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] inst: ${os.getCurrentInst()}, onLayerStudioReturned that:`, that);
}

if (os.getCurrentInst() != that.inst) {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] Inst mismatch. Current: ${os.getCurrentInst()}, that: ${that.inst}. Ignoring.`);
    }
    return;
}

if (that.studioId) {
    if (tags.homeEggHatched) {
        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] home egg already hatched for ${that.inst}; skipping.`);
        }
        return;
    }
    masks.homeEggHatched = true;

    //Check for user logged in
    if (!authBot) {
        console.log(`[${tags.system}.${tagName}]: User must be signed in to save data`);
        await os.requestAuthBot();
    }

    if (!authBot) {
        console.log(`[${tags.system}.${tagName}]: User login failed.`);
        masks.homeEggHatched = null;
        return;
    }

    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] Requesting 'home' egg for studioId ${that.studioId}`);
    }

    const eggResult = await ab.links.search.onLookupABEggs({ recordKey: that.studioId, abID: "home", autoHatch: true, sourceEvent: 'ask'});

    if (eggResult && eggResult.success === false) {
        // Hatch failed — clear the flag so a later attempt can retry.
        masks.homeEggHatched = null;
        return;
    }

    await os.sleep(0);
    superShout("homeLayerLoaded");
}