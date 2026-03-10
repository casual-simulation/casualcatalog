const { 
    abID,
    abVersion,
    initialBoot,
    autoHatch,
    returnType,
    eggParameters,
    key = configBot.tags.key,
    toast = true,
    showIndicator = true,
    onPreprocessBeforeCreate,
    sourceEvent, // sourceEvent is an event name that symbolizes what triggered this call. (optional)
} = that;

let {
    recordKey = configBot.tags.studio,
} = that;

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] that:`, {...that});
}

links.utils.abLog(links.personality.tags.abBuilderIdentity + ": loading " + abID);

//clear ab-1
if (links.manifestation && configBot.tags.menuPortal == "abMenu") {
    links.manifestation.abClick();
}

let busyIndicator;

if (showIndicator) {
    if (!links.menu) {
        await links.learn.abAdapt('abInterface');
    }

    busyIndicator = await links.menu.abCreateMenuBusyIndicator({ abMenu: true, label: `loading ${abID}`});
}

const possibleAuth = authBot ? authBot : true;
let getRecord = await os.getData(recordKey, abID);

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] getRecord:`, {...getRecord});
}

let eggData;

//this logic handles the retrieved data, searches again if none came through
if (!getRecord.success) {
    if (possibleAuth.id == recordKey &&
        links.remember.tags.abRecordKey &&
        getRecord.errorCode === "record_not_found"
    ) {
        getRecord = await os.getData(links.remember.tags.abRecordKey, abID);
    } else if (getRecord.errorCode === "not_authorized") {
        if (!recordKey) {
            await os.requestAuthBot();
            recordKey = authBot.id;
        }

        await os.grantInstAdminPermission(recordKey);
        getRecord = await os.getData(recordKey, abID);
    } else if (getRecord.errorCode === "not_logged_in") {
        await os.requestAuthBot();

        if (!recordKey) {
            recordKey = authBot.id;
        }

        getRecord = await os.getData(recordKey, abID);

        if (!getRecord.success && 
            getRecord.errorCode === "not_authorized"
        ) {
            await os.grantInstAdminPermission(recordKey);
            getRecord = await os.getData(recordKey, abID);
        }
    }
}

if (!getRecord.success) {
    if (toast) { 
        os.toast(`no data found in ${abID}`);
    }

    shout("abMenuRefresh");

    if (busyIndicator) {
        destroy(busyIndicator);
    }

    return { success: false };
}
else {
    const publicReadTest = getRecord.markers.indexOf("publicRead");
    const author = await os.requestAuthBotInBackground();

    if (publicReadTest != -1 && author) {
        if (authBot.tags.privacyFeatures.allowPublicData) {
            const eggHatchEvent = abID;

            os.recordEvent(links.remember.tags.abRecordKey, eggHatchEvent);
        }
    }

    //package the record data
    eggData = getRecord.data;

    if (abVersion) {
        // Change initial target version of the egg if abVersion is provided.
        eggData.targetVersion = abVersion;
    }
}

if (returnType != null) {
    if (getRecord.success) {
        if (returnType === "data") {
            let version = getRecord.data.targetVersion - 1;

            if (abVersion) {
                if (!isNaN(abVersion)) {
                    version = abVersion - 1;
                }
            }

            const eggDataURL = getRecord.data.eggVersionHistory[version];
            const returnData = await os.getFile(eggDataURL);

            if (busyIndicator) {
                destroy(busyIndicator);
            }

            return returnData;
        } else if (returnType === "egg") {
            if (busyIndicator) {
                destroy(busyIndicator);
            }

            // Simply return the egg data if requested.
            return getRecord.data;
        }
    } else {
        // This is for backwards compatibility with old aux files stored before the record system existed.
        if (returnType === "data") {
            const versionArray = JSON.parse(eggData.eggVersionHistory);
            const fileUUID = versionArray[eggData.maxVersion - 1];
            const filenamehashLTM = crypto.sha256(fileUUID);
            const fileurlhashLTM = "aux_" + filenamehashLTM + '.aux';
            const targetLTMURL = "https://builder-ltm-files.s3.amazonaws.com/" + fileurlhashLTM;
            const o = {
                method: "GET",
                url: targetLTMURL
            };

            let fileGet = await webhook(o);

            if (busyIndicator) {
                destroy(busyIndicator);
            }

            if (fileGet.status != 200) {
                if (toast) {
                    os.toast("no file found");
                }

                shout("abRefresh");

                return { success: false };
            }
            else {
                fileGet = fileGet.data;
            }

            return fileGet;
        }
    }
}

//ab specific variables for understanding if a position is specified
let currentDim;
let spaceMod;
let dimensionX;
let dimensionY;
let dimMod;

//handle dimension identification
if (links.manifestation) {
    if (links.manifestation.links.abBot) {
        const abBot = links.manifestation.links.abBot;

        currentDim = abBot.tags.dimension;
    }
}
else {
    currentDim = os.getCurrentDimension();
}

//checks for grid focus
if (!links.remember.tags.abGridFocus) {
    dimensionX = null;
    dimensionY = null;
}
else {
    let hatchPoint = links.remember.tags.abGridFocus;

    currentDim = hatchPoint.dimension;
    dimensionX = hatchPoint.position.x;
    dimensionY = hatchPoint.position.y;
    spaceMod = { space: "shared" };
}

//this logic handles logic around autoHatch vs manual hatching
if (!autoHatch && configBot.tags.pattern == null) {
    dimMod = {
        [currentDim]: true,
        [currentDim + "X"]: dimensionX,
        [currentDim + "Y"]: dimensionY,
        dimension: currentDim
    };
}
else {
    dimMod = { autoHatch: true, key };
}

//call for ovo with information provided
const manifestResult = await thisBot.manifestOvo({
    abID,
    studio: recordKey,
    dimMod,
    spaceMod,
    eggData,
    initialBoot,
    eggParameters,
    onPreprocessBeforeCreate,
    sourceEvent,
});

if (busyIndicator) {
    destroy(busyIndicator);
}

links.utils.abLog(abPersonality.tags.abBuilderIdentity + ": " + abID + " loaded, version " + getRecord.data.targetVersion + " of " + getRecord.data.maxVersion);

return {
    success: true,
    hatchedBots: manifestResult?.hatchedBots,
};