console.log("running!!")
let openCollectionID = masks.openCollectionID;

let artifactBot = getBot(byTag("artifactJournal", true));
let info = artifactBot.tags.artifactData.find(artifact => artifact.id === artifactBot.tags.collectableIDs[openCollectionID][that]);

if (artifactBot.tags.userData.collectedArtifacts.find(item => item.id == artifactBot.tags.collectableIDs[openCollectionID][that])?.state == 'collected'){
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

    thisBot.closeApp();
    infoBot.openApp(openCollectionID);
}
else{
    let index = artifactBot.tags.artifactCollectableInfo.findIndex(item => item.id === info.id);
    let landmark = artifactBot.tags.artifactCollectableInfo[index].attributes.Landmark.data.attributes.Name;

    let artifactSpawner = getBot(byTag("name", "artifactSpawner"));
    let locationData = artifactSpawner.tags.landmarkData.find(x => x.attributes.Name === landmark)

    os.tip("Location: " + locationData.attributes.Name + " (" + locationData.attributes.Latitude + ", " + locationData.attributes.Longitude + ")");
}