const { modality, buttonId } = that;

if (modality === 'mouse' && buttonId !== 'left') {
    return;
}

if (tags.busy) {
    return;
}


const inXR = configBot.tags.inAR || configBot.tags.inVR;

if (inXR) {
    masks.busy = true;
    masks.label = 'non-xr only';
    masks.color = '#333333';
    masks.labelColor = 'white';

    await os.sleep(1000);

    masks.busy = null;
    masks.label = null;
    masks.color = null;
    masks.labelColor = null;
    
    return;
}

const SUPPORTED_FILE_EXTS = [
    'jpg',
    'jpeg',
    'webp',
    'gif',
    'png',
    'svg',
    // 'glb',
    // 'gltf',
    // 'mp3',
    // 'mp4',
]

function getFileExtension(filename) {
    if (typeof filename !== 'string') return '';
    const parts = filename.split('.');
    return parts.length > 1 ? parts.pop().toLowerCase() : '';
}

const selectedFiles = await os.showUploadFiles();
console.log(`[${tags.system}.${tagName}] selectedFiles:`, selectedFiles);

const filteredFiles = selectedFiles.filter((file) => {
    const ext = getFileExtension(file.name);

    if (ext) {
        return SUPPORTED_FILE_EXTS.includes(ext);
    } else {
        return false;
    }
})
console.log(`[${tags.system}.${tagName}] filteredFiles:`, filteredFiles);

if (filteredFiles.length === 0 && selectedFiles.length > 0) {
    os.toast(`The following files are supported: ${SUPPORTED_FILE_EXTS.join(', ')}`, 5);
    return;
}

masks.label = 'uploading...';
masks.color = '#999999';
masks.busy = true;

try {
    for (let i = 0; i < filteredFiles.length; i++) {
        const result = await links.mediaUpload.requestMediaUpload(filteredFiles[i])
        console.log(`[${tags.system}.${tagName}] requestMediaUpload result:`, result);
    }
} finally {
    masks.label = null;
    masks.color = null;
    masks.busy = null; 
}