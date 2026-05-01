if (masks.abAttachmentCameraState === 'opened') {
    destroy(links.captureLoadingBar);
    masks.captureLoadingBar = null;
    if (tags.previousMenuPortal != null) {
        configBot.masks.menuPortal = tags.previousMenuPortal;
        tags.previousMenuPortal = null;
    }
}

masks.abAttachmentCameraState = 'closed';

thisBot.refreshAttachmentsDropdown();
