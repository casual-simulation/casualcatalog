if (that.tags.includes("nearbyPlayer")) {
    if (tags.nearbyPlayer) {
        shout("onBotNearLandmark", {'landmarkID': tags.landmarkID, 'bot': getBot(byID(tags.nearbyPlayer))});
    } else {
        shout("onBotNearLandmarkExit", {'landmarkID': tags.landmarkID});
        
        const artifactData = getBot("artifactJournal", true);
        const discovered = artifactData.tags.userData.discoveredLandmarks.includes(tags.landmarkID);
        tags.discovered = discovered;

        thisBot.setStatusVisuals();
    }
}