if (tags.usingGPS) {
    masks.abNavigation_kitSelfSelectMenuLabel = "stop following my location";
} else {
    masks.abNavigation_kitSelfSelectMenuLabel = null;
}

if (configBot.tags.mapPortal) {
    masks.abNavigation_kitSelfSelectMenuHide = null;
} else {
    masks.abNavigation_kitSelfSelectMenuHide = true;
}