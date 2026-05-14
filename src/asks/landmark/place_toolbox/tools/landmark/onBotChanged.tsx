if (that.tags.includes("nearbyPlayer")) {
    if (tags.nearbyPlayer) {
        thisBot.onBotNearLandmark({'landmarkID': tags.landmarkID, 'bot': getBot(byID(tags.nearbyPlayer))});
        await os.startFormAnimation(thisBot, "static");
    } else {
        shout("onBotNearLandmarkExit", {'landmarkID': tags.landmarkID});
        
        const artifactData = getBot("artifactJournal", true);
        const discovered = artifactData.tags.userData.discoveredLandmarks.includes(tags.landmarkID);
        tags.discovered = discovered;

        thisBot.setStatusVisuals();
        await os.startFormAnimation(thisBot, "idle");
    }
}

if (that.tags.includes("landmarkLocked")) {
    if (tags.landmarkLocked) {
        await os.startFormAnimation(thisBot, "idle");
    } else {
        await os.startFormAnimation(thisBot, "static");
    }
}