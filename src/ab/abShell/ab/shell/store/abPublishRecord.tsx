await os.requestAuthBot();

let publicFacing = that.publicFacing;
let recordData = that.recordData ?? that.data;
let recordName = that.recordName;
let endpoint = that.endpoint ? that.endpoint : links.remember.tags.abEndpoint;
let markerSet = that.markerSet ?? new Set();
let userRecord = that.userRecord ?? configBot.tags.selected_studioID ?? authBot.id;
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

function doRecord() {
    return os.recordData(userRecord, recordName, recordData, { endpoint: endpoint, markers: markerSet.size > 0 ? Array.from(markerSet) : undefined });
}

let recordResponse = await doRecord();

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] recordResponse:`, recordResponse);
}

if (!recordResponse.success) {
    if (recordResponse.errorCode === 'not_authorized') {
        // Ask user to grant permission.
        const permission = await os.grantInstAdminPermission(userRecord);

        if (permission.success) {
            recordResponse = await doRecord();

            if (tags.debug) {
                console.log(`[${tags.system}.${tagName}] try again recordResponse:`, recordResponse);
            }
        }
    }
}

if (recordResponse.success) {
    ab.links.utils.abLogAndToast({ message: `data published to record ${userRecord} at address ${recordName}`, logType: 'log', toast: toast });
} else {
    ab.links.utils.abLog({ message: `data failed to publish to record ${userRecord} at address ${recordName}\n${JSON.stringify(recordResponse, undefined, 2)}`, logType: 'error' });

    if (toast) {
        ab.links.utils.abToast({ message: `data failed to publish to record ${userRecord} at address ${recordName}. ${recordResponse.errorMessage}`, logType: 'error' });
    }
}

return recordResponse;