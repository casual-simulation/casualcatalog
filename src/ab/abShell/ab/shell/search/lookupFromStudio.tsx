const askID = that?.askID;
const autoHatch = that?.autoHatch ?? true;
const eggParameters = that?.eggParameters;
const sourceEvent = that?.sourceEvent;
const onPreprocessBeforeCreate = that?.onPreprocessBeforeCreate;
const reserved = that?.reserved;
const isChannel = that?.isChannel;
const isUUAB = that?.isUUAB;
const dataOnly = that?.dataOnly ?? false;

let lookupAsk: ABLookupAskIDResult;
let usedStudio;

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] that:`, {...that});
}

// Check the ab record for the ask.
const abFormattedAskID = askID.replaceAll("-", "");

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] abFormattedAskID:`, abFormattedAskID);
}

if (reserved) {
    if (configBot.tags.studio) {
        if (configBot.tags.studio != authBot.id) {
            const perms = await os.listUserStudios();
            if (perms.success) {
                const found = perms.studios.find((stud) => {
                    return (stud.studioId == configBot.tags.studio);
                });
                console.log("[abReservedAsks]: User permissions for studio", found, perms);
                if (!found) {
                    console.log("[abReservedAsks]: User does not have permissions for this studio.")
                    return lookupAsk;
                }
            }
        }
        usedStudio = configBot.tags.studio;
        lookupAsk = await os.getData(configBot.tags.studio, abFormattedAskID);
        if (!lookupAsk.success && lookupAsk.errorCode && lookupAsk.errorCode == 'not_authorized') {
            await os.grantInstAdminPermission(configBot.tags.studio);
            lookupAsk = await os.getData(configBot.tags.studio, abFormattedAskID);
                
            if (!lookupAsk.success) {
                console.log("[abReservedAsks]: failure looking up ask in studio", {...lookupAsk});
            } else {
                console.log("[abReservedAsks]: Looked up ask in studio", {...lookupAsk});
            }
        }
    } else {
        usedStudio = authBot?.id;
        lookupAsk = await os.getData(authBot?.id, abFormattedAskID);
        if (!lookupAsk.success && lookupAsk.errorCode && lookupAsk.errorCode == 'not_authorized') {
            await os.grantInstAdminPermission(authBot?.id);
            lookupAsk = await os.getData(authBot?.id, abFormattedAskID);
                
            if (!lookupAsk.success) {
                console.log("[abReservedAsks]: failure looking up ask in user studio", {...lookupAsk});
            } else {
                console.log("[abReservedAsks]: Looked up ask in user studio", {...lookupAsk});
            }
        }
    }
} else {
    usedStudio = links.remember.tags.abRecordKey;
    lookupAsk = await os.getData(links.remember.tags.abRecordKey, `ask_${abFormattedAskID}`, links.remember.tags.abEndpoint);
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] lookupAsk attempt 1:`, {...lookupAsk});
    }
    if (!lookupAsk.success) {
        lookupAsk = await os.getData(links.remember.tags.abRecordKey, abFormattedAskID, links.remember.tags.abEndpoint);
        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] lookupAsk attempt 2:`, {...lookupAsk});
        }
    }

    if (!lookupAsk.success && isUUAB) {
        usedStudio = configBot.tags.studio ?? authBot.id;
        lookupAsk = await os.getData(configBot.tags.studio ?? authBot.id, abFormattedAskID);
        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] lookupAsk attempt 3 (isUUAB):`, {...lookupAsk});
        }
        if(lookupAsk.errorCode && lookupAsk.errorCode == 'not_authorized') {
            await os.grantInstAdminPermission(configBot.tags.studio ?? authBot.id);
            lookupAsk = await os.getData(configBot.tags.studio ?? authBot.id, abFormattedAskID);
        }
    }

    if (!lookupAsk.success && isChannel) {
        usedStudio = configBot.tags.studio ?? authBot.id;
        lookupAsk = await os.getData(configBot.tags.studio ?? authBot.id, abFormattedAskID);
        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] lookupAsk attempt 3 (isChannel):`, {...lookupAsk});
        }
        if(lookupAsk.errorCode && lookupAsk.errorCode == 'not_authorized') {
            await os.grantInstAdminPermission(configBot.tags.studio ?? authBot.id);
            lookupAsk = await os.getData(configBot.tags.studio ?? authBot.id, abFormattedAskID);
        }
    }
}

lookupAsk.origin = 'ab_record';

if (lookupAsk.success && (lookupAsk.data.patternID || reserved || isChannel || isUUAB)) {
    if (dataOnly) {
        return lookupAsk;
    } else {
        // Lookup the egg using the studioID and patternID from the ab_record ask.
        const lookupEgg: ABLookupEggResult = await thisBot.onLookupABEggs({ abID: (reserved || isChannel || isUUAB) ? abFormattedAskID : lookupAsk.data.patternID, recordKey: lookupAsk.data.studioID ?? usedStudio, autoHatch, eggParameters, onPreprocessBeforeCreate, sourceEvent });
        
        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] lookupEgg:`, {...lookupEgg});
        }

        lookupAsk.success = lookupEgg.success;
        lookupAsk.hatchedBots = lookupEgg.hatchedBots;
    }
} else if (lookupAsk.success && !lookupAsk.data.patternID && !lookupAsk.data.url) {
    lookupAsk.success = false;
}

return lookupAsk;