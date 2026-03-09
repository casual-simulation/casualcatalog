if (that.tags.includes("nearbyPlayer")) {
    if (tags.nearbyPlayer) {
        shout("onBotNearLandmark", {'landmarkID': tags.landmarkID, 'bot': getBot(byID(tags.nearbyPlayer))});
    } else {
        shout("onBotNearLandmarkExit", {'landmarkID': tags.landmarkID});
    }
}