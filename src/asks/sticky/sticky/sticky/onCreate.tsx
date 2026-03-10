if (tags.abIDOrigin == "sticky" && tags.system != "toolbox1.tool.sticky") {
    tags.firstLoad = true;
}

whisper(thisBot, 'checkForUI');

const stickyData = {...thisBot.tags};
const unstoredTags = tags.unstoredTags;
for (var t of unstoredTags) {
    delete stickyData[t];
}

tags.abIgnore = true;

tags.lastUpdateHash = crypto.hash("sha256", "base64", JSON.stringify(stickyData));