await os.requestAuthBot();

if (!thisBot.canPublishFile()) {
    return {
        success: false,
        errorCode: 'not_authorized',
        errorMessage: 'User is not authorized to publish files.'
    }
}

let file = that.file;
let fileName = that.fileName;
let mimeType = that.mimeType;
let markerSet = that.markerSet ?? new Set();
let publicFacing = that.publicFacing ?? true;
let userRecord = configBot.tags.selected_studioID ?? authBot.id;

if (!file) {
    return {
        success: false,
        errorCode: 'invalid_file_data',
        errorMessage: 'A file must be provided to publish.'
    }
}

assert(markerSet instanceof Set, `[${tags.system}.${tagName}] markerSet must be an instance of Set`);

// [Ryan Cook] HACK: There are issues with custom markers. Clear all of the except for publicRead.
markerSet.clear();

if (publicFacing) {
    markerSet.add('publicRead');
}

let fileUpload = await os.recordFile(userRecord, file, { description: fileName, mimeType: mimeType, markers: markerSet.size > 0 ? Array.from(markerSet) : undefined });

if (!fileUpload.success) {
    if (fileUpload.errorCode == "file_already_exists") {
        links.utils.abLog({ message: `file already exists in ${userRecord}`, logType: 'log' });
        return fileUpload;
    }

    await os.grantInstAdminPermission(userRecord);

    fileUpload = await os.recordFile(userRecord, file, { description: fileName, mimeType: mimeType, markers: markerSet.size > 0 ? Array.from(markerSet) : undefined });
}

if (fileUpload.success) {
    links.utils.abLog({ message: `file recorded to ${userRecord}`, logType: 'log' });
}
else {
    links.utils.abLog({ message: `file failed to record`, logType: 'error' });
}

return fileUpload;