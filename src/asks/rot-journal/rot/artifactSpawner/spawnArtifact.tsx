// gets the location and visual data that was passed on
configBot.tags.abSilentMode = true;
let imgData = that?.imgData ?? ""
let latitude = that?.latitude ?? 0
let longitude = that?.longitude ?? 0
let artifactData = that?.artifactData
let landmarkName = that?.landmarkName ?? "Landmark"
let landmarkData = that?.landmarkData ?? " "
let artifacts = getBots(byTag("#system", "rot.artifacts.artifact"))
let artifactID = that?.artifactID ?? 0

let templateArtifact = getBot(byTag("#system", "rot.templates.landmark"))

console.log("[RoT] Spawning artifact")
if (templateArtifact !== undefined) {
    let newLandmark = create(templateArtifact)
    whisper(newLandmark, "onEggHatch", {
        abID: "rot-templateArtifact",
        recordKey: "1259f269-03b9-41d4-b088-c199d8f586ec",
        autoHatch: true,
        eggParameters: {
            spawnX: longitude,
            spawnY: latitude,
            //scale: 3,
            imageURL: imgData,
            //form: "sphere",
            discoveredForm: "sprite",
            name: landmarkName,
            landmarkAttributes: landmarkData,
            artifactID: artifactID,
            allData: that?.allData ?? {}
        }
    })
}
else {
    // spawns in the model artifact
    links.search.onLookupAskID({
        askID: "rot-templateArtifact",
        sourceEvent: 'tool',
        eggParameters: {
            spawnX: longitude,
            spawnY: latitude,
            //scale: 3,
            imageURL: imgData,
            //form: "sphere",
            discoveredForm: "sprite",
            name: landmarkName,
            landmarkAttributes: landmarkData,
            artifactID: artifactID,
            allData: that?.allData ?? {}
        },
    });
}
// removes all duplicate Landmarks
// waits for the bot to completely spawn and initalize before running landmark specific interations
await os.sleep(5000)
thisBot.ensureNoDuplicates()
const playerBot = getBot(byTag("#playerID", configBot.id))
if (playerBot != null) {
    playerBot.toggleVisibleArtifacts()
}