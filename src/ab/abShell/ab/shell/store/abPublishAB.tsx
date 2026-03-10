if (!authBot) {
    links.utils.abLogAndToast({ message: "must be logged in to publish patterns.", logType: "error" });
    return;
}

if (!thisBot.canPublishFile()) {
    links.utils.abLogAndToast({ message: "must have subscription that supports file publishing.", logType: "error" });
    return 
}

if (that.ab.indexOf(" ") != -1 || that.ab.indexOf('"') != -1) {
    links.utils.abLogAndToast({ message: "pattern names may not contain spaces or quotaion marks, please try again.", logType: "error" });
    return;
}


links.utils.abLog(`publishing ${that.ab}`);

if (!that.keepMenu) {
   shout("abMenuRefresh"); 
}

//ab variables
const abID = that.ab;
let key = that.key;
let target = that.target ? that.target : that.bot;
const publicFacing = that.publicFacing ?? configBot.tags.publicFacing;
const baseAB = that.baseAB ?? links.remember.tags.baseAB;
const studio = that.studio ?? (configBot.tags.selected_studioID ?? authBot.id);
const onPreprocessBeforePublish = that.onPreprocessBeforePublish; // callback function that can be used to preprocess the data before it is published. (optional)
const manualPublish = that.manualPublish;
const sourceEvent = that.sourceEvent; // sourceEvent is an event name that symbolizes what triggered this call. (optional)
const eggMarkerSet = that.eggMarkerSet ?? new Set();
const auxMarkerSet = that.auxMarkerSet ?? new Set();
const state = {};
let formattedFile = {};

assert(eggMarkerSet instanceof Set, `[${tags.system}.${tagName}] eggMarkerSet must be an instance of Set`);
assert(auxMarkerSet instanceof Set, `[${tags.system}.${tagName}] auxMarkerSet must be an instance of Set`);

configBot.tags.publicFacing = null;

eggMarkerSet.add('abEgg');
eggMarkerSet.add(abID);

auxMarkerSet.add('abAux');
auxMarkerSet.add(abID);

let busyIndicator;
if (manualPublish && !configBot.tags.abSilentMode) {
    configBot.masks.menuPortal = "abMenu";

    if (!links.menu) {
        await links.learn.abAdapt('abInterface');
    }
    
    busyIndicator = await links.menu.abCreateMenuBusyIndicator({ abMenu: true, label: `uploading ${that.ab}`, onDestroy: `@console.log('busy indicator go boom')`});
}

// Let all bots know that ab is about to start publishing.
const beforePublishArg = { ab: abID, studio, publicFacing, sourceEvent };
await Promise.allSettled(shout('onABBeforePublish', beforePublishArg));

if (!target || target.length < 1) {
    if (configBot.tags.abExcludeUnclaimed && configBot.tags.selectedAB) {
        target = getBots(b => b.space === 'shared' && !b.tags.abIgnore && b.tags.abIDOrigin === abID);

        configBot.tags.abExcludeUnclaimed = null;
    } else if (configBot.tags.selectedAB && getBot("abIDOrigin", baseAB)) {
        const eggBots = getBots(b => b.space === 'shared' && !b.tags.abIgnore && b.tags.abIDOrigin === configBot.tags.selectedAB);
        const newBots = getBots(b => b.space === 'shared' && !b.tags.abIgnore && b.tags.abIDOrigin == null);

        target = [...eggBots, ...newBots];
    } else {
        target = getBots(b => b.space === 'shared' && !b.tags.abIgnore);
    }

    setTag(target, "abIDOrigin", abID);

    configBot.tags.selectedAB = null;

    if (target.length < 1) {
        links.utils.abLogAndToast("no bots found to publish");

        if (!that.keepMenu) {
            shout("abMenuRefresh"); 
        }

        links.manifestation.abClick();

        return;
    }
}

//this logic handles generating a key for encryption (optional)
if (configBot.tags.encryption) {
    let keyCheck;

    configBot.tags.encryption = null;

    key = await os.showInput("", {
        type: 'secret',
        title: 'enter a secret key'
    });

    if (key) {
        keyCheck = await os.showInput("", {
            type: 'secret',
            title: 'confirm secret key'
        });
    }

    if (key != keyCheck) {
        if (!keyCheck) {
            links.utils.abLogAndToast("no key entered");
        } else {
            links.utils.abLogAndToast("keys do not match");
        }

        if (!that.keepMenu) {
            shout("abMenuRefresh"); 
        }

        links.manifestation.abClick();

        return;
    }
}

//formatting bots for file storage
if (Array.isArray(target)) {
    for (let i = 0; i < target.length; i++) {
        let currentBotID = target[i].id;
        let currentBotData = JSON.parse(JSON.stringify(target[i]));

        state[currentBotID] = currentBotData;
    }
}
else {
    state[target.id] = JSON.parse(JSON.stringify(target));
}

//checks for previous eggs and returns data for previously published ab's
let eggCheck = await thisBot.abPreviousEggCheck({ abID: abID });

//add xp bot here
state.abXPBot = {
    space: "shared",
    id: "abXPBot",
    tags: {
        form: "nothing",
        system: "ab.pattern.abXPBot",
        authorID: authBot.id,
        version: eggCheck.eggData.maxVersion,
        xp: links.learn.tags.abXP,
        signature: eggCheck.signature,
        abIgnore: true,
    }
};

// Do another preprocessing pass that allows listeners to preprocess the ab data before it is published.
let preprocessArg = { botData: state, ab: abID, studio, publicFacing, sourceEvent };

if (onPreprocessBeforePublish) {
    await onPreprocessBeforePublish(preprocessArg)
}

await Promise.allSettled(shout('onABPreprocessBeforePublish', preprocessArg));

//additional file data
formattedFile.version = 1;
formattedFile.signature = eggCheck.signature;
formattedFile.state = state;

//actual encryption if chosen
if (key) {
    formattedFile = JSON.stringify(formattedFile);
    formattedFile = crypto.encrypt(key, formattedFile);
}

//publish the file and the egg record.
let publishFile;
let publishRecord;

publishFile = await thisBot.abPublishFile({ file: formattedFile, fileName: abID, publicFacing: true, markerSet: auxMarkerSet });

if (publishFile.success) {
    //gather addional egg data
    const aiPermitCheck = await os.getData(authBot.id, "ai_permit");
    const aiPermitID = aiPermitCheck.success ? aiPermitCheck.data.permitID : false;

    eggCheck.eggData.aiPermit = aiPermitID;
    eggCheck.eggData.eggVersionHistory.push(publishFile.url);
    eggCheck.eggData.maxVersion = eggCheck.eggData.eggVersionHistory.length;
    eggCheck.eggData.targetVersion = eggCheck.eggData.eggVersionHistory.length;
    
    //publish egg/ab record
    publishRecord = await thisBot.abPublishRecord({ data: eggCheck.eggData, recordName: abID, publicFacing, markerSet: eggMarkerSet, toast: false });
}

if (publishFile.success && publishRecord.success) {
    //publishing shout
    superShout("onABPublished", { success: publishFile.success, ab: abID, fileAddress: publishFile.url });
    superShout("onAbPublished", { success: publishFile.success, ab: abID, fileAddress: publishFile.url }); // Backwards compatibility.

    const bios = publicFacing ? "free" : "local";
    const instType = publicFacing ? "free" : "local";

    setTagMask(links.learn, "abXP", "0", "local");

    if (manualPublish) {
        let siteOrigin = new URL(configBot.tags.url).origin;
        const url = siteOrigin + "/?pattern=" + abID + "&studio=" + studio + "&bios=" + bios;
        os.setClipboard(url);

        if (key) {
            links.utils.abLogAndToast(`${instType} inst url with encrypted data copied to clipboard: ${url}`);
        } else {
            links.utils.abLogAndToast(`${instType} inst url copied to clipboard: ${url}`);
        }
    }

    try {
        await analytics.recordEvent('ab_egg_publish', { ab: abID, version: eggCheck.eggData.eggVersionHistory.length });
    } catch (e) {
        console.log(e);
    }
}
else {
    let errorMessage;

    if (!publishFile.success) {
        errorMessage = publishFile.errorMessage ?? publishFile.errorCode;
    } else if (!publishRecord.success) {
        errorMessage = publichRecord.errorMessage ?? publishRecord.errorCode;
    } else {
        errorMessage = 'Unknown reason';
    }

    links.utils.abLogAndToast({
        message: `Publishing failed: ${errorMessage}`,
        logType: 'error',
        toast: !configBot.tags.abSilentMode
    })
}

if (busyIndicator) {
    destroy(busyIndicator);
}

return publishRecord;