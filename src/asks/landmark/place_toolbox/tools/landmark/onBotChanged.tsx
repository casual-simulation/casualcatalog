if (that.tags.includes("nearbyPlayer")) {
    if (tags.nearbyPlayer) {
        thisBot.onBotNearLandmark({'landmarkID': tags.landmarkID, 'bot': getBot(byID(tags.nearbyPlayer))});
        await os.startFormAnimation(thisBot, "static", {
            loop: {
            mode: 'repeat'
        }});
    } else {
        shout("onBotNearLandmarkExit", {'landmarkID': tags.landmarkID});
        
        const artifactData = getBot("artifactJournal", true);
        const discovered = artifactData.tags.userData.discoveredLandmarks.includes(tags.landmarkID);
        tags.discovered = discovered;

        thisBot.setStatusVisuals();
        await os.stopFormAnimation(thisBot);
    }
}

if (that.tags.includes("landmarkLocked")) {
    if (tags.landmarkLocked) {
        await os.stopFormAnimation(thisBot);
    } else {
        await os.stopFormAnimation(thisBot);
        await os.startFormAnimation(thisBot, "static", {
            loop: {
            mode: 'repeat'
        }});
    }
}