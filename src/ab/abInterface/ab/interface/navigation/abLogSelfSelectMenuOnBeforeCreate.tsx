if (tags.usingGPS) {
    masks.abLogSelfSelectMenuLabel = "stop following my location";
} else {
    masks.abLogSelfSelectMenuLabel = null;
}

if (configBot.tags.mapPortal) {
    masks.abLogSelfSelectMenuHide = null;
} else {
    masks.abLogSelfSelectMenuHide = true;
}