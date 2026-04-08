tags.discovered = true; 
thisBot.setStatusVisuals();

const artifactData = getBot("artifactJournal", true);
if (artifactData) {
    artifactData.discoverLandmark(tags.landmarkID);
}

const landmarkInfoMenu = getBot("name", "landmarkInfoMenu");
if (landmarkInfoMenu) {
    landmarkInfoMenu.openApp(tags.landmarkID);
}