// function to find the distance between two points on a globe
function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance; // in kilometers
}

// helper function
function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}


let artifacts = getBots(byTag("#system", "rot.artifacts.artifact"))

if(artifacts === []){
    // if theres no artifacts then leave
    return;
}

for (let i = 0; i < artifacts.length; i++) {
    let currArtifact = artifacts[i]

    const mapDimension = globalThis.mapDimension ?? 'map';

    // gets the player
    const player = getBot(byTag("#playerID", configBot.id))
    // gets the players long and lat
    let pLong = player.tags[mapDimension + "X"]
    let pLat = player.tags[mapDimension + "Y"]

    // gets the artifacts long and lat
    let aLong = currArtifact.tags[mapDimension + "X"]
    let aLat = currArtifact.tags[mapDimension + "Y"]

    let distanceFromPlayer = haversineDistance(pLat, pLong, aLat, aLong)
    
    // stores which players are near inside each artifact
    currArtifact.tags["playerNear" + configBot.id] = !(distanceFromPlayer >= tags.artifactInteractionRadiusKm) ? true : false
    // triggers a rotate animation
    whisper(currArtifact,"rotateAnimation")
}