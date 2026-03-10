// const currentURL = new URL(configBot.tags.url);
// const origin = currentURL.origin;

// let newURL = new URL(origin);

// if (configBot.tags.comId) {
//     newURL.searchParams.append("comId", comId);
// }

// newURL.searchParams.append("bios", 'free');

// newURL.searchParams.append("ask", 'rot-launcher');

// os.openURL(newURL.href);

if (that) {
    if (that.modality == 'mouse' && that.buttonId == 'right') {
        return;
    }
}

if (!tags.discoverableData) {
    thisBot.getDataFromStrapi();
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

thisBot.openCamera();