if (that.name === 'request_media_upload') {
    console.log(`[${tags.system}.${tagName}] request_media_upload received. event data:`, that.that);

    const response = { success: null, url: null, requestId: that.that.requestId };

    if (authBot) {
        try {
            console.log(`[${tags.system}.${tagName}] starting upload of file ${that.that.name}.`);
            const fileArrayBuffer = bytes.fromBase64String(that.that.fileBase64).buffer;
            const file = {
                ...that.that,
                data: fileArrayBuffer,
            }

            const uploadResult = await links.input.onFileUpload({ file, copyUrl: false });
            const url = uploadResult.url || uploadResult.existingFileUrl;

            console.log(`[${tags.system}.${tagName}] upload result:`, uploadResult);

            if (url) {
                response.success = true;
                response.url = url;
            } else {
                response.success = false;
            }
        } finally {
            response.success = false;
        }
    } else {
        response.success = false;
    }

    // Inform remote of result.
    console.log(`[${tags.system}.${tagName}] sending request_media_upload_response:`, response);
    sendRemoteData(that.remoteId, 'request_media_upload_response', response);

} else if (that.name === 'request_media_upload_response') {
    if (thisBot.vars.onRequestMediaUploadResponse) {
        thisBot.vars.onRequestMediaUploadResponse(that.that);
    }
}