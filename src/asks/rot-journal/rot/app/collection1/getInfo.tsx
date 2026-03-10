console.log("running!!")
let openCollectionID = masks.openCollectionID;

let artifactBot = getBot(byTag("name", "artifactData"));
let info = artifactBot.tags.artifactInfo.find(artifact => artifact.id === artifactBot.tags.collectableIDs[openCollectionID][that]);

let saveLoad = getBot("name", "saveload");
let itemSaves = saveLoad.masks.itemSaves;

if (saveLoad.masks.itemSaves[artifactBot.tags.collectableIDs[openCollectionID][that]-1] == 2){
    let infoBot = getBot(byTag("name", "info"));
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

    /*let infoBot = getBot(byTag("name", "info"));
    infoBot.tags.itemName = tags.artifactInfo[that].attributes.Name;
    infoBot.tags.itemYear = tags.artifactInfo[that].attributes.Year;
    if (tags.artifactInfo[that].attributes.RealImageUrl) infoBot.tags.imageSrc = tags.artifactInfo[that].attributes.RealImageUrl;
    else infoBot.tags.imageSrc = tags.artifactInfo[that].attributes.PhotoUrl;
    infoBot.tags.itemInfo = tags.artifactInfo[that].attributes.Description;
    infoBot.tags.itemInteractive = tags.artifactInfo[that].attributes.Interactive;
    infoBot.tags.itemInteractiveLink = tags.artifactInfo[that].attributes.InteractiveUrl;
    infoBot.tags.itemLink = tags.artifactInfo[that].attributes.GRPMUrl;
    infoBot.tags.itemCollection = tags.name;

    thisBot.closeApp();
    infoBot.openApp(tags.name[10]);*/
}
else{
    let index = artifactBot.tags.artifactCollectableInfo.findIndex(item => item.id === info.id);
    let landmark = artifactBot.tags.artifactCollectableInfo[index].attributes.Landmark.data.attributes.Name;

    let artifactSpawner = getBot(byTag("name", "artifactSpawner"));
    let locationData = artifactSpawner.tags.landmarkData.find(x => x.attributes.Name === landmark)

    os.tip("Location: " + locationData.attributes.Name + " (" + locationData.attributes.Latitude + ", " + locationData.attributes.Longitude + ")");
}

//artifactBot.tags.artifactInfo.find(artifact => artifact.id === artifactBot.tags.collectableIDs[openCollectionID][that]).attributes.PhotoUrl