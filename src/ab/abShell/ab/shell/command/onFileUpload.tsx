import { RecordFileResult } from 'casualos';

//filter out times when file loading is not allowed
if (!builderVersion || links.remember.tags.abListeningForFileUploads !== true) {
    return;
}

//various file specific variables
let fileExtension = that.file.name.split('.').pop().toLowerCase();
let fileName = that.file.name.split('.').shift();
let size = that.file.size;
let copyUrl = that.copyUrl ?? true;
let focusCamera = that.focusCamera ?? true;
let mimeType;
const botInfo = {};

//hard limit based on file size
if (size > 200000000) {
    links.utils.abLogAndToast({ message: "maximum file size exceeded (200 mb)", logType: 'error' });
    return;
}

/**
 * Helper function for retrieving image dimensions & aspect from ArrayBuffer data.
 * Requires CasualOS be configured to have access to the DOM.
 */
function getImageDimensions(arrayBuffer, mimeType) {
    return new Promise((resolve, reject) => {
        const blob = new Blob([arrayBuffer], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const img = new self.Image();
        img.onload = () => {
            resolve({ width: img.naturalWidth, height: img.naturalHeight, aspect: img.naturalWidth / img.naturalHeight });
            URL.revokeObjectURL(url);
        };
        img.onerror = reject;
        img.src = url;
    });
}

//this switch handles possible files extensions, while rejecting any it does not recognize
switch (fileExtension) {
    case 'jpg':
    case 'jpeg':
    case 'webp':
    case 'gif':
    case 'png':
        mimeType = "image/" + fileExtension;
        botInfo.form = "sprite";
        botInfo.anchorPoint = '🧬[0,0,-0.01]';

        if (os.device().supportsDOM) {
            const imageDimensions = await getImageDimensions(that.file.data, mimeType);

            // Adjust scale to respect aspect ratio. This is "cover" scaling style.
            if (imageDimensions.aspect >= 1) {
                botInfo.scaleX = imageDimensions.aspect;
            } else {
                botInfo.scaleY = 1 / imageDimensions.aspect;
            }
        }

        break;
    case 'svg':
        mimeType = "image/svg+xml";
        botInfo.form = "sprite";
        botInfo.anchorPoint = '🧬[0,0,-0.01]';

        if (os.device().supportsDOM) {
            const imageDimensions = await getImageDimensions(that.file.data, mimeType);

            // Adjust scale to respect aspect ratio. This is "cover" scaling style.
            if (imageDimensions.aspect >= 1) {
                botInfo.scaleX = imageDimensions.aspect;
            } else {
                botInfo.scaleY = 1 / imageDimensions.aspect;
            }
        }
        
        break;
    case 'glb':
    case 'exr':
    case 'gltf':
        mimeType = "text/xml";
        botInfo.form = "mesh";
        botInfo.formSubtype = "gltf";
        break;
    case 'aux':
    case 'pdf':
        let botData = fileExtension == ".aux" ? JSON.parse(that.file.data).state : os.parseBotsFromData(that.file.data);
        await links.create.abCreateBots({ bots: botData, origin: fileName, sourceEvent: 'file_upload' });
        return;
    case 'mp3':
        mimeType = 'audio/mpeg';
        botInfo.onClick = "@ os.playSound(tags.formAddress);";
        botInfo.label = "Click to Play";
        break;
    case 'mp4':
        mimeType = 'video/mp4';
        botInfo.form = "iframe";
        botInfo.formSubtype = "src";
        break;
    case 'otf':
        mimeType = 'font/otf';
        botInfo.label = "example";
        break;
    case 'woff':
        mimeType = 'font/woff';
        botInfo.label = "example";
        break;
    default:
        links.utils.abLogAndToast({ message: `file type not supported`, logType: 'error' });
        return new Error("unhandled file type: " + fileExtension);
}

//the following variables and objects set up a loading bar button
configBot.masks.menuPortal = "abMenu";

if (!links.menu) {
    await links.learn.abAdapt('abInterface');
}

let progressButton = await links.menu.abCreateMenuBusyIndicator({ abMenu: true, label: `uploading` });

configBot.tags.selected_studioID = configBot.tags.studioID ?? configBot.tags.studio;

if (!configBot.tags.selected_studioID) {
    await os.requestAuthBot();

    configBot.tags.selected_studioID = authBot.id;
}

//this is the actual upload functionality
let uploadResult: RecordFileResult = await links.store.abPublishFile({ file: that.file.data, fileName: fileName, mimeType: mimeType });

if (uploadResult) {
    if (uploadResult.success || uploadResult.errorCode === 'file_already_exists') {
        const fileURL = uploadResult.url ?? uploadResult.existingFileUrl;

        //if the file should be included as a bot with a link, this logic handles that
        if (Object.keys(botInfo).length > 0) {
            let dimension = links.remember.tags.abActiveDimension;

            if (!dimension) {
                // Try to fallback to whatever is the visible portal.
                if (configBot.tags.mapPortal) {
                    dimension = configBot.tags.mapPortal;
                } else if (configBot.tags.gridPortal) {
                    dimension = configBot.tags.gridPortal;
                }
            }

            if (dimension) {
                botInfo[dimension] = true;

                if (links.manifestation.links.abBot) {
                    let position = getBotPosition(links.manifestation.links.abBot, dimension);
                    botInfo[dimension + 'X'] = position.x;
                    botInfo[dimension + 'Y'] = position.y;
                    botInfo[dimension + 'Z'] = position.z;
                }
            }

            if (mimeType.includes("font")) {
                botInfo.labelFontAddress = fileURL;
            } else {
                botInfo.formAddress = fileURL;
            }
            
            botInfo.abFileUpload = true;

            const bot = create(botInfo);

            if (focusCamera) {
                os.focusOn(bot, { duration: 1 }).catch(e => {})
            }
        }

        if (copyUrl) {
            os.setClipboard(fileURL);
            
            links.utils.abToast({ message: `File url copied to clipboard.`, logType: 'log' });
            links.utils.abLog({ message: `File url copied to clipboard: ${fileURL}`, logType: 'log' });
        }
    } else {
        links.utils.abToast({ message: `Failed to upload file. Reason: ${uploadResult.errorMessage}`, logType: 'error' });
        links.utils.abLog({ message: `Failed to upload file. Result: ${JSON.stringify(uploadResult)}`, logType: `error`});
    }
} else {
    links.utils.abLogAndToast({ message: `Something went wrong with file upload.`, logType: `error`});
}

//clear the progress bar button
configBot.masks.menuPortal = null;

if (progressButton) {
    destroy(progressButton);
}

return uploadResult;