
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
    //Check for user logged in
    if (!authBot) {
        console.log(`[${tags.system}.${tagName}]: User must be signed in to save data`);
        await os.requestAuthBot();
    }

    if (!authBot) {
        console.log(`[${tags.system}.${tagName}]: User login failed.`);
        return;
    }
    
    await ab.links.search.onLookupABEggs({ recordKey: that.studioId, abID: "home", autoHatch: true, sourceEvent: 'ask'});
    await os.sleep(0);
    superShout("homeLayerLoaded");
}