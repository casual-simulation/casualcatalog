if (!tags.userData) {
    tags.userData = {
        discoveredLandmarks: [],
        collectedArtifacts: []
    }
}

if (!that) {
    return;
}

if (!tags.userData.collectedArtifacts.find(item => item.id == that)) {
    tags.userData.collectedArtifacts.push({
        id: that,
        state: "collected"
    });
}