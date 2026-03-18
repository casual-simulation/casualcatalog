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

//open info menu
let info = tags.artifactData.find(artifact => artifact.id === that);

let infoBot = getBot(byTag("name", "infoMenu"));
infoBot.tags.itemName = info.attributes.Name;
infoBot.tags.itemYear = info.attributes.Year;
if (info.attributes.RealImageUrl) infoBot.tags.imageSrc = info.attributes.RealImageUrl;
else infoBot.tags.imageSrc = info.attributes.PhotoUrl;
infoBot.tags.itemInfo = info.attributes.Description;
infoBot.tags.itemInteractive = info.attributes.Interactive;
infoBot.tags.itemInteractiveLink = info.attributes.InteractiveUrl;
infoBot.tags.itemLink = info.attributes.GRPMUrl;
infoBot.tags.itemCollection = tags.name;

if (tags.currentRegisteredApp) {
    os.unregisterApp(tags.currentRegisteredApp);
    tags.currentRegisteredApp = null;
}
infoBot.openApp();

thisBot.saveData();