if (ab.links.remember.tags.hostID) {
    tags.abShowMenuLabel = "join code: " + ab.links.remember.tags.hostID;
} else {
    tags.abShowMenuLabel = "generate join code";
}

if (configBot.tags.staticInst != undefined) {
    masks.abShowMenuHide = true;
}