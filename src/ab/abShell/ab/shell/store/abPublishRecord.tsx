await os.requestAuthBot();

let publicFacing = that.publicFacing;
let recordData = that.data;
let recordName = that.recordName;
let endpoint = that.endpoint ? that.endpoint : links.remember.tags.abEndpoint;
let markerSet = that.markerSet ?? new Set();
let userRecord = configBot.tags.selected_studioID ?? authBot.id;
let toast = that.toast ?? true;

if (!recordData) {
    return "no data supplied";
}

assert(markerSet instanceof Set, `[${tags.system}.${tagName}] markerSet must be an instance of Set`);

// [Ryan Cook] HACK: There are issues with custom markers. Clear all of the except for publicRead.
markerSet.clear();

if (publicFacing) {
    markerSet.add('publicRead');
}

recordData = await os.recordData(userRecord, recordName, recordData, { endpoint: endpoint, markers: markerSet.size > 0 ? Array.from(markerSet) : undefined });

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] recordData result:`, recordData);
}

if (recordData.success) {
    ab.links.utils.abLogAndToast({ message: `data published to record ${userRecord} at address ${recordName}`, logType: 'log', toast: toast });
} else {
    ab.links.utils.abLog({ message: `data failed to publish to record ${userRecord} at address ${recordName}\n${JSON.stringify(recordData, undefined, 2)}`, logType: 'error' });

    if (toast) {
        ab.links.utils.abToast({ message: `data failed to publish to record ${userRecord} at address ${recordName}. ${recordData.errorMessage}`, logType: 'error' });
    }
}

return recordData;