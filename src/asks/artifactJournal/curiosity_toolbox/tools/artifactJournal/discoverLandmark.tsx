if (!tags.userData) {
    tags.userData = {
        discoveredLandmarks: [],
        collectedArtifacts: []
    }
}

if (!that) {
    return;
}

if (!tags.userData.discoveredLandmarks.includes(that) && tags.continueLocationPull) {
    tags.userData.discoveredLandmarks.push(that);
    thisBot.saveData();
}

