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