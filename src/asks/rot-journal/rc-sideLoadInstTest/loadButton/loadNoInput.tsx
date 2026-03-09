const inst = that[0];

async function loadInst(instToLoad) {
    return new Promise((resolve) => {

        const onInstJoined = (listenerThat) => {
            if (listenerThat.inst === instToLoad) {
                removeListenTagListener(null, 'onInstJoined', onInstJoined);

                // HACK: As of writing (Feb 1 2024) there is no way to know when ab has been fully loaded into the new inst.
                // So until then, we are just going to wait a healthy amount of time and hope that ab is loaded by then.
                os.sleep(2000).then(() => {
                    resolve();
                });
            }
        }

        addListenTagListener(null, 'onInstJoined', onInstJoined)
        os.loadInst(instToLoad);
    })
}

if (inst) {
    let pattern = that[1];

    if (!pattern) {
        pattern = null;
    }

    // Remove ab/pattern from URL query params if it is there. 
    // Otherwise the new ab in the new inst will use it to load an undesirable pattern.
    configBot.tags.ab = null;
    configBot.tags.pattern = null;

    let loadMessage = 'Load inst ' + inst;
    if (pattern) {
        loadMessage += ' with pattern ' + pattern;
    }

    os.toast(loadMessage, 3);

    await loadInst(inst);
    
    superShout("sendIsLoaded");
    await os.sleep(50);
    
    // Disable listening on the ab search bot for a moment.
    abSearch.tags.listening = false;

    // Super shout the ab patten loading function.
    if (masks.isLoaded != true) superShout('onLookupABEggs', {
        abID: pattern,
        autoHatch: true,
    });

    //superShout("openMiniGrid");

    masks.isLoaded = false;
    
    // Wait for a moment and then turn listening on the ab search bot back on.
    await os.sleep(1000);
    abSearch.tags.listening = true;
}