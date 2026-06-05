if (!tags.userData) {
    tags.userData = {
        discoveredLandmarks: [],
        collectedArtifacts: []
    }
}

if (!that) {
    return;
}

if (!tags.userData.discoveredLandmarks.includes(that) && links.homeworld?.tags.usingGPS) {
    tags.userData.discoveredLandmarks.push(that);
    thisBot.saveData();
}

