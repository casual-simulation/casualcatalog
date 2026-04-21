if (that) {
    if (that.modality == 'mouse' && that.buttonId == 'right') {
        return;
    }
}

shout('abMenuRefresh');
shout("clearRoTCameraMenu");

configBot.tags.menuPortal = 'rotCamera_menu';

const menuOptions = {
    rotCamera_menu: true,
    clearRoTJournalMenu: `@destroy(thisBot);`,
    abMenuRefresh: "@ destroy(thisBot);",
    camera: getLink(thisBot)
}

if (!tags.discoverableData) {
    await thisBot.getDataFromStrapi();
}

if (tags.processingMode == 'teachableMachine') {
    thisBot.useTeachMac();
} else {
    thisBot.openCamera();
}