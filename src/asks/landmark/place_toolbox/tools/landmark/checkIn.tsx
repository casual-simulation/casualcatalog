const journal = getBot("artifactJournal", true);

tags.discovered = true; 
thisBot.setStatusVisuals();

if (journal?.tags?.continueLocationPull) {
    if (journal) {
        journal.discoverLandmark(tags.landmarkID);
    }
}

const landmarkInfoMenu = getBot("name", "landmarkInfoMenu");
if (landmarkInfoMenu) {
    landmarkInfoMenu.openApp(tags.landmarkID);
}

const arts = getBots(byTag("rotArtifact", true), byTag("landmarkIDs", landmarks => landmarks.includes(tags.landmarkID)));
whisper(arts, "onBotNearLandmark", {'landmarkID': tags.landmarkID, 'bot': getBot(byID(tags.nearbyPlayer))})