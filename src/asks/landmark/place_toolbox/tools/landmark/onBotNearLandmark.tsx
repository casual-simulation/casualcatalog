if (that.landmarkID == tags.landmarkID && that.bot.tags.mapAvatar == true && that.bot.tags.remoteID == getID(configBot)) {
    that.bot.masks.nearLandmark = true;
    tags.discovered = true; 
    thisBot.setStatusVisuals();

    const artifactData = getBot("artifactJournal", true);
    if (artifactData) {
        artifactData.discoverLandmark(tags.landmarkID);
    }
}