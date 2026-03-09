if (that.modality == 'mouse' && that.buttonId == 'right') {
    thisBot.showRightClickMenu();

    return;
}  

const currentURL = new URL(configBot.tags.url);
const origin = currentURL.origin;

let newURL = new URL(origin);

if (configBot.tags.comId) {
    newURL.searchParams.append("comId", comId);
}

newURL.searchParams.append("ask", "casualTutorial");
newURL.searchParams.append("bios", "free");

os.openURL(newURL.href);