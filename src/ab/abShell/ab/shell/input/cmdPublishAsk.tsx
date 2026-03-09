const args = that;

const askID = ABCommandsManager.parseArgValue(args, '-ask');
const patternID = ABCommandsManager.parseArgValue(args, '-pattern');
let studioID = ABCommandsManager.parseArgValue(args, '-studio');

if (!askID) {
    links.utils.abLogAndToast({ message: `-ask is a required argument`, logType: 'error'});
    return;
}

if (!patternID) {
    links.utils.abLogAndToast({ message: `-pattern is a required argument`, logType: 'error'});
    return;
}

if (!studioID) {
    if (authBot) {
        studioID = authBot.id;
    } else {
        links.utils.abLogAndToast({ message: `Either provide a studio or login to use your personal studio for the ask.`, logType: 'error'});
        return;
    }
}

let publishResult;

try {
    publishResult = await links.store.abPublishAskID({ askID, patternID, studioID });
} catch (e) {
    links.utils.abLogAndToast({ message: `Failed to publish ask '${askID}'. ${links.utils.getErrorMessage(e)}`, logType: 'error'});
    return;
}

if (publishResult.success) {
    // Need to use configBot studio tag for lookup.
    configBot.masks.studio = studioID;
    await os.sleep(0);
    
    try {
        const lookupAskResult = await links.search.lookupFromStudio({ askID, dataOnly: true });

        if (lookupAskResult.success && lookupAskResult.data) {
            links.utils.abLogAndToast({ message: `Published ask '${askID}'. ${JSON.stringify(lookupAskResult.data, undefined, 2)}`, logType: 'log'});
        } else {
            links.utils.abLogAndToast({ message: `Failed to lookup ask '${askID}' in studio '${studioID}'.`, logType: 'error'});
        }
    } catch (e) {
        links.utils.abLogAndToast({ message: `Failed to lookup ask '${askID}' in studio '${studioID}'. ${links.utils.getErrorMessage(e)}`, logType: 'error'});
    }

    configBot.masks.studio = null;
} else {
    links.utils.abLogAndToast({ message: `Failed to publish ask '${askID}'.`, logType: 'error'});
    return;
}


