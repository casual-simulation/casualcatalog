const { photo } = that;

const inXR = configBot.tags.arEnabled || configBot.tags.vrEnabled;

masks.abAttachmentCameraState = 'captured';

if (tags.shutterSoundUrl) {
    const soundURL = await ab.abBuildCasualCatalogURL(tags.shutterSoundUrl);
    if (soundURL) {
        os.playSound(soundURL);
    }
}

destroy(links.captureLoadingBar);
masks.captureLoadingBar = null;

if (tags.previousMenuPortal != null) {
    configBot.masks.menuPortal = tags.previousMenuPortal;
    tags.previousMenuPortal = null;
}

const base64 = bytes.toBase64String(new Uint8Array(await photo.data.arrayBuffer()));
const mimeType = photo.data.type || 'image/png';
const name = `photo_${ab.links.utils.abFileTimecode()}`

const current: ABAttachment[] = ab.links.ask?.vars.abAttachments ?? [];
current.push({ name, mimeType, base64 });
if (ab.links.ask) {
    ab.links.ask.vars.abAttachments = current;
}

thisBot.refreshAttachmentsDropdown();