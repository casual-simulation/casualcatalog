if (!links.menu) {
    await links.learn.abAdapt('abInterface');
}

let menuDimension = that.menuDimension ?? configBot.tags.menuPortal;
let progressButton;

if (menuDimension) {
    progressButton = await links.menu.abCreateMenuBusyIndicator({ [menuDimension]: true, label: `publishing ${that.askID}` });
}

await os.requestAuthBot();

const patternID = that.patternID;
const studioID = that.studioID ? that.studioID : configBot.tags.selected_studioID ? configBot.tags.selected_studioID : authBot.id;
const askID = "ask_" + that.askID.replaceAll("-", "");
const endpoint = links.remember.tags.abEndpoint;
const markerSet = that.markerSet ?? new Set();
const toast = that.toast ?? true;

assert(markerSet instanceof Set, `[${tags.system}.${tagName}] markerSet must be an instance of Set`);

markerSet.add('publicRead');
markerSet.add('abAsk');

// [Ryan Cook] HACK: There are issues with custom markers. Clear all of the except for publicRead.
markerSet.clear();
markerSet.add('publicRead');

// Check to see if this askID already exists in the casual catalog. Casual catalog asks always override ab asks and so user's should be aware.
const existsInCasualCatalog = await ab.links.search.abCasualCatalogAskIDExists({ askID: that.askID });

if (!existsInCasualCatalog) {
    const publishAsk = await os.recordData(links.remember.tags.abRecordKey, askID, { patternID: patternID, studioID: studioID }, { endpoint: endpoint, updatePolicy: [authBot.id], markers: markerSet.size > 0 ? Array.from(markerSet) : undefined });

    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] publishAsk result:`, publishAsk);
    }

    if (publishAsk.success) {
        links.utils.abLog({ message: `ask ${that.askID} published to ab record.`, logType: 'log' });

        if (toast) {
            links.utils.abToast({ message: `ask ${that.askID} published.`, logType: 'log' });
        }
    } else {
        links.utils.abLog({ message: `ask ${that.askID} failed to publish to ab record.\n${JSON.stringify(publishAsk, undefined, 2)}`, logType: 'error' });

        if (toast) {
            links.utils.abToast({ message: `failed to publish ask ${that.askID}. ${publishAsk.errorMessage}`, logType: 'error' });
        }
    }

    if (progressButton) {
        destroy(progressButton);
    }

    return publishAsk;
} else {
    links.utils.abLogAndToast({ message: `askID '${that.askID}' already exists in the casual catalog. Please choose a different name.`, logType: 'error' });

    if (progressButton) {
        destroy(progressButton);
    }
    
    // Return an object in the shape of RecordDataFailure.
    return {
        success: false,
        errorCode: 'askid_exists_casual_catalog',
        errorMessage: `Casual catalog already contains the askID '${askID}'`
    }
}