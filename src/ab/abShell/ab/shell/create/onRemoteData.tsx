if (that.name === 'remote_ab_added') {
    const abEggId = that.that.abEggId;

    if (abEggId) {
        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] starting search for abEgg bot with id ${abEggId}, Event data:`, that.that);
        }

        // Wait for the abEgg bot to arrive. Once it has, we should be able to safely shout onRemoteABAdded and have all the bots in the inst.
        let abEgg = getBot('id', abEggId);
        let accumSearchTime = 0;
        const MAX_SEARCH_TIME_MS = 20000;
        const SEARCH_INTERVAL_MS = 250;
        
        while(!abEgg) {
            await os.sleep(SEARCH_INTERVAL_MS);

            if (accumSearchTime <= MAX_SEARCH_TIME_MS) {
                accumSearchTime += SEARCH_INTERVAL_MS;
                abEgg = getBot('id', abEggId);
            } else {
                console.error(`[${tags.system}.${tagName}] remote_ab_added event received but abEggId ${abEggId} never arrived.`);
                break;
            }
        }

        if (abEgg) {
            if (tags.debug) {
                console.log(`[${tags.system}.${tagName}] found abEgg bot with id ${abEggId}`);
            }

            superShout('onRemoteABAdded', that.that);
        }
    } else {
        console.error(`[${tags.system}.${tagName}] remote_ab_added event received but not abEggId was provided. Event data:`, that.that);
    }
}