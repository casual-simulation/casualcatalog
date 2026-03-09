// prevents initialization from happening multiple times
if (masks.initialized) {
    return;
}

// makes sure that all of the preliminary initialization (setting globalThis vars for bots, importing the d3-force-3d library) happens
await Promise.all(shout('onBeforeInitialize'));

// primarily starts the botManager's cleanup routine and attempts to setup sims for any bots that exist at initialization
await Promise.all(shout('onInitialize'));

masks.initialized = true;
