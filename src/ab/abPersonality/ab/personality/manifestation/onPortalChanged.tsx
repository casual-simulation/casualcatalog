const PORTALS_THAT_HIDE = new Set([
    "systemPortal",
    "sheetPortal"
])

const PORTALS_THAT_MANIFEST = new Set([
    "gridPortal",
    "mapPortal"
]);

const MAP_LOAD_WAIT_TIME = 1000;

for (const portal of PORTALS_THAT_HIDE) {
    if (configBot.tags[portal] != null) {
        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] a portal that hides ab is open - hiding abBot and ignoring.`);
        }

        if (tags.abBot) {
            destroy(links.abBot);
        }

        return;
    }
}

if (configBot.tags.sheetPortal != null || configBot.tags.systemPortal != null) {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] sheet portal or system portal opened - hiding abBot and ignoring.`);
    }

    if (tags.abBot) {
        destroy(links.abBot);
    }

    return;
}

if (!tags.abAwake) {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] ab is not awake - ignoring.`);
    }
    return;
}

if (that.portal == "tagPortal") {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] tagPortal changed - ignoring.`);
    }
    return;
}

if (that.portal == "menuPortal") {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] menuPortal changed - ignoring.`);
    }
    return;
}

if (that.portal == "gridPortal" && configBot.tags.mapPortal) {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] gridPortal changed, but also already in the mapPortal - ignoring.`);
    }
    return;
}

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] that:`, that);
}

// The map portal is tough. It seems to vary in loading speed on
// various hardware and networks and has by the time onPortalChanged is called it doesnt
// seem guarenteed to be actually ready. Adding a hardcoded wait time to give the portal space to get
// the map portal fully loaded before continuing with manifesting ab.
//
// At some point this can go away if we ever get a shout or some other gaurentee that the map portal is loaded/ready.
if (that.portal === 'mapPortal') {
    if (that.dimension) {
        if (!thisBot.vars.mapPortalLoaded && !thisBot.vars.mapPortalInitialLoaded) {
            if (!thisBot.vars.mapPortalLoadWaiter) {
                thisBot.vars.mapPortalLoadWaiter = os.sleep(MAP_LOAD_WAIT_TIME)
            }

            if (tags.debug) {
                console.log(`[${tags.system}.${tagName}] waiting for map portal to finish loading: ${MAP_LOAD_WAIT_TIME}ms`);
            }

            thisBot.vars.mapPortalLoadWaiter.then(() => {
                thisBot.vars.mapPortalLoadWaiter = null;
                thisBot.vars.mapPortalLoaded = true;
                thisBot.vars.mapPortalInitialLoaded = true;

                if (tags.debug) {
                    console.log(`[${tags.system}.${tagName}] map portal loaded.`);
                }
            })

            // await thisBot.vars.mapPortalLoadWaiter;
            // thisBot.vars.mapPortalLoadWaiter = null;
            // thisBot.vars.mapPortalLoaded = true;
        } else {
            if (tags.debug) {
                console.log(`[${tags.system}.${tagName}] map portal is already loaded.`);
            }
        }
    } else {
        thisBot.vars.mapPortalLoaded = false;
        thisBot.vars.mapPortalLoadWaiter = null;

        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] map portal has been unloaded.`);
        }
    }
}

// Start checks for if/where we need to manifest ab.
let newAB = false;
let newABPortal;
let newABPosition;
let focusCamera = true;
let focusCameraStartZoom;

if (PORTALS_THAT_MANIFEST.has(that.portal) && that.dimension) {
    // A portal that manifests ab has just changed dimension.
    // Manifest ab in the new dimension.
    if (that.portal == "mapPortal" || that.portal == "miniMapPortal") {;
        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] manifesting ab bot in map portal dimension '${that.dimension}'.`);
        }

        newABPosition = await thisBot.getDefaultManifestPosition('map');
        newABPortal = that.portal;
        newAB = await thisBot.abManifestBot({ dimension: that.dimension, position: newABPosition });
        focusCameraStartZoom = await thisBot.getStartCameraZoom('map');
    }
    else {
        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] manifesting ab bot dimension '${that.dimension}'.`);
        }

        newABPosition = await thisBot.getDefaultManifestPosition('grid');
        newABPortal = that.portal;
        newAB = await thisBot.abManifestBot({ dimension: that.dimension, position: newABPosition });
        focusCameraStartZoom = await thisBot.getStartCameraZoom('grid');
    }
} else if ((PORTALS_THAT_MANIFEST.has(that.portal) || PORTALS_THAT_HIDE.has(that.portal)) && 
           !that.dimension && 
           (configBot.tags.gridPortal || configBot.tags.mapPortal)
) {
    // A portal that typically hides or re-manifests ab just closed, but either the grid or map portal are still open.
    // Summon ab in either the mapPortal or gridPortal.
    let summonDimension;

    if (configBot.tags.mapPortal) {
        summonDimension = configBot.tags.mapPortal;
        newABPortal = 'mapPortal';
        
        if (links.remember.tags[summonDimension + 'ABLastPosition']) {
            // Use last known position.
            newABPosition = links.remember.tags[summonDimension + 'ABLastPosition'];
        } else {
            // Use default map position.
            newABPosition = await thisBot.getDefaultManifestPosition('map');
        }
    } else if (configBot.tags.gridPortal) {
        summonDimension = configBot.tags.gridPortal;
        newABPortal = 'gridPortal';

        if (links.remember.tags[summonDimension + 'ABLastPosition']) {
            // Use last known position.
            newABPosition = links.remember.tags[summonDimension + 'ABLastPosition'];
        } else {
            // Use default grid position.
            newABPosition = await thisBot.getDefaultManifestPosition('grid');
        }
    }

    if (summonDimension) {
        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] summoning ab bot in ${newABPortal} dimension '${summonDimension}'.`);
        }

        newAB = await thisBot.abManifestBot({ dimension: summonDimension, position: newABPosition });

        if (PORTALS_THAT_HIDE.has(that.portal)) {
            // If the portal that closed was a portal that hides ab, then dont run the camera focus.
            // This will just use the previous camera position already stored in memory.
            if (tags.debug) {
                console.log(`[${tags.system}.${tagName}] will not focus camera on ab because we are just assuming the previous camera position.`);
            }
            focusCamera = false;
        }
    } else {
        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] both the map and grid portal are both closed, cannot summon ab in either.`);
        }
    }
} else {
    return;
}

if (focusCamera && links.remember.tags.mapPreventFocus) {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] skipping camera focus animation because mapPreventFocus is set to true on the ab remember bot.`);
    }

    focusCamera = false;
}

if (newAB && focusCamera) {
    if (thisBot.vars.activeFocusInfo && 
        thisBot.vars.activeFocusInfo.portal === that.portal && 
        thisBot.vars.activeFocusInfo.dimension === that.dimension &&
        thisBot.vars.activeFocusInfo.position?.x === newABPosition.x &&
        thisBot.vars.activeFocusInfo.position?.y === newABPosition.y
    ) {
        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] skipping camera focus animation because one is already active with the same settings.`);
        }

        return;
    }

    thisBot.vars.activeFocusInfo = { 
        portal: that.portal, 
        dimension: that.dimension,
        position: {...newABPosition},
    };

    let zoom = tags.defaultGridPortalZoom;

    if (newABPortal === 'mapPortal' || newABPortal === 'miniMapPortal') {
        zoom = tags.defaultMapPortalZoom;
    }
    
    try {
        if (focusCameraStartZoom != null) {
            if (tags.debug) {
                console.log(`[${tags.system}.${tagName}] set start zoom of ${newABPortal} to ${focusCameraStartZoom}.`);
            }

            if (thisBot.vars.mapPortalLoadWaiter) {
                await thisBot.vars.mapPortalLoadWaiter;
            }

            await os.focusOn(newABPosition, { zoom: focusCameraStartZoom, duration: 0, portal: newABPortal });
            await os.sleep(1000);
        }

        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] focus on ${JSON.stringify(newABPosition)} in ${newABPortal} with zoom ${zoom}.`);
        }

        if (!tags.abInitialized) { 
            // [Ryan] Really weird CasualOS bug that causes the portal camera to not respect zoom level if we dont do this.
            await os.sleep(250); 
        }

        await os.focusOn(newABPosition, { zoom, rotation: { x: 45, y: 45 }, portal: newABPortal })
    } catch (e) {
        if (tags.debug) {
            console.warn(`[${tags.system}.${tagName}] focusOn error occured:`, e);
        }
    } finally {
        thisBot.vars.activeFocusInfo = null;
    }
}