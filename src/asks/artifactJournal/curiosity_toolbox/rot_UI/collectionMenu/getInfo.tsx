let openCollectionID = masks.openCollectionID;

let artifactBot = getBot(byTag("artifactJournal", true));
let info = artifactBot.tags.artifactData.find(artifact => artifact.id == that);

if (artifactBot.tags.userData.collectedArtifacts.find(item => item.id == that)?.state == 'collected'){
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
    let index = artifactBot.tags.artifactLocationData.findIndex(item => item?.attributes?.Artifact?.data?.id === info.id);
    let landmark = artifactBot.tags.artifactLocationData[index].attributes.Landmark.data.attributes;

    os.tip("Location: " + landmark.Name + " (" + landmark.Latitude + ", " + landmark.Longitude + ")");
}