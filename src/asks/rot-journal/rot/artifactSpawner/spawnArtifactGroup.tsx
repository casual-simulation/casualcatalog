let artifactData = that?.artifactVisualData ?? thisBot.getArtifactVisualData()
let artifactLocationData = that?.artifactLocationData ?? thisBot.getArtifactLocationData()
let landmarkData = that?.landmarkData ?? thisBot.getLandmarkData()
let imgData = ""
let longitude = 0
let latitude = 0
let locationDataObj = artifactLocationData[0]
let landmarkName="Landmark"
let artifactID=0
// finds the player
const playerBot = getBot(byTag("#playerID", configBot.id))

for (let i = 0; i < artifactData.length; i++) {
    imgData = artifactData[i].attributes.PhotoUrl

    // finds the corresponding name in the location data
    locationDataObj = landmarkData.find(obj => obj.attributes.Name === artifactLocationData[i].attributes.Landmark.data.attributes.Name)
    let artifactDataObj = artifactLocationData.find(obj => obj.attributes.Artifact.data.attributes.Name === artifactData[i].attributes.Name)
    longitude = parseFloat(locationDataObj.attributes.Longitude)
    latitude = parseFloat(locationDataObj.attributes.Latitude)
    
    landmarkName=locationDataObj.attributes.Name
    artifactID=artifactDataObj.id
    // if either are undefined, then find a place next to the player
    if (longitude == 0 || latitude == 0) {

        const mapDimension = globalThis.mapDimension ?? 'map';
        longitude = playerBot.tags[mapDimension + "X"]
        latitude = playerBot.tags[mapDimension + "Y"]

        // how close each artifact can spawn
        const distanceInMiles = 0.5
        const distanceInKm = distanceInMiles * 1.60934; // Convert miles to kilometers

        // Convert distance from kilometers to degrees
        const distanceInDegrees = distanceInKm / 111.32; // Approximate conversion

        // Generate random offsets for latitude and longitude within the distance in degrees
        const randomLatOffset = (math.random() * 2 - 1) * distanceInDegrees;
        const randomLonOffset = (math.random() * 2 - 1) * (distanceInDegrees / Math.cos(latitude * (Math.PI / 180)));

        // Apply the offsets to the original latitude and longitude
        const newLat = latitude + randomLatOffset;
        const newLon = longitude + randomLonOffset;

        latitude = newLat
        longitude = newLon
    }

    // formats the artifact attributes alphabetically to check for 
    // spawns a singular artfact at the defined point
    thisBot.spawnArtifact({
        imgData: imgData,
        longitude: longitude,
        latitude: latitude,
        artifactData: artifactData,
        landmarkData:locationDataObj.attributes,
        landmarkName:landmarkName,
        artifactID:artifactID,
        allData: artifactDataObj.attributes

    })
}
