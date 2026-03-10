console.log(`[${tags.system}.${tagName}] that:`, that);

assert(typeof that === 'object' && that.data && that.name && that.size, `[${tags.system}.${tagName}] parameter must be a file object`);

if (authBot) {
    // User is logged in, they can upload it themselves.
    // const result = links.store.abPublishFile({ file: that.data, })
    const uploadResult = await links.input.onFileUpload({ file: that, copyUrl: false });
    let url = uploadResult.url || uploadResult.existingFileUrl;

    if (url) {
        return { success: true, url }
    } else {
        return { success: false }
    }
} else {
    // Find a remote that will upload the file for you.
    let requestId = uuid();
    let fileBase64 = bytes.toBase64String(that.data);
    let remoteIds = await os.remotes();
    const RESPONSE_TIMEOUT_MS = 30000; // 30 seconds.

    async function waitForResponse() {
        return new Promise((resolve) => {
            const done = (result) => {
                clearTimeout(timer);
                thisBot.vars.onRequestMediaUploadResponse = null;
                resolve(result);
            }

            const timer = setTimeout(() => done({ success: false }), RESPONSE_TIMEOUT_MS);

            thisBot.vars.onRequestMediaUploadResponse = (data) => {
                if (data.requestId === requestId) {
                    console.log(`[${tags.system}.${tagName}] response received from remote ${data.remoteId}. response: ${JSON.stringify(data)}`);
                    done(data);
                }
            }
        })
    }

    for (let remoteId of remoteIds) {
        if (remoteId === configBot.id) {
            // Skip self.
            continue;
        }

        console.log(`[${tags.system}.${tagName}] requesting remote ${remoteId} to upload media file ${that.name}.`);
        
        const waitForResponsePromise = waitForResponse();

        // Send upload request to remote.
        sendRemoteData(remoteId, 'request_media_upload', { 
            fileBase64, 
            size: that.size, 
            name: that.name, 
            mimeType: that.mimeType, 
            requestId
        });

        const response = await waitForResponsePromise;

        if (response.success || response.url) {
            response.success = true; // Weird quirk of ab's onFileUpload.

            return response;
        } else {
            // Going to try next remote.
        }
    }

    // No remotes could upload the media.
    console.log(`[${tags.system}.${tagName}] no remotes could upload the media.`);
    return { success: false }
}