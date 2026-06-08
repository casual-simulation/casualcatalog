const args = that;

async function uploadFile({ file, recordKey }) {
    let fileExtension = file.name.split('.').pop();
    let fileName = file.name.split('.').shift();
    let mimeType;

    switch (fileExtension) {
        case 'svg':
            mimeType = "image/svg+xml";
            break;
        case 'glb':
        case 'gltf':
            mimeType = "text/xml";
            break;
        default:
            mimeType = file.mimeType;
            break;
    }

    let url;
        
    configBot.tags.selected_studioID = recordKey;
    const [result] = await Promise.all(shout('abPublishFile', { file, fileName, mimeType }));
    configBot.tags.selected_studioID = null;
    
    if (result.url) {
        url = result.url;
    } else if (result.existingFileUrl) {
        url = result.existingFileUrl;
    }

    return { url };
}

const recordKey = ABCommandsManager.parseArgValue(args, '-record');
const selectedFiles = await os.showUploadFiles();
const publishRecord = getBot('system', 'rc-package-dev.publishRecord');

if (selectedFiles && selectedFiles.length) {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] Upload ${selectedFiles.length} files...`);
    }

    let doneHtml = '';

    if (recordKey) {
        doneHtml += `<h2>Record Id</h2>`;
        doneHtml += `<p>${recordKey}</p>`;
    }

    doneHtml += '<h2>Uploaded Files</h2>';
    
    for (let i = 0; i < selectedFiles.length; i++) {
        os.showHtml(`Uploading ${selectedFiles[i].name}...`);
        
        const result = await uploadFile({
            file: selectedFiles[i],
            recordKey,
            onProgress: (fileProgress) => {
                os.showHtml(`Uploading ${selectedFiles[i].name} ${Math.ceil(fileProgress * 100)}%`);
            }
        });
        
        if (result.url) {
            doneHtml += `<a href="${result.url}" target="_blank">${selectedFiles[i].name}</a></br>`;
        }

        console.log(`[${tags.system}.${tagName}] Upload ${selectedFiles[i].name} result:`, result);
    }

    os.showHtml(doneHtml);
}