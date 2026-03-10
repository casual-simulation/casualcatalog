//let collectionBot = getBot(byTag("name", "collection" + that));
let collectionBot = getBot(byTag("name", "collectionMenu"));
let artifactData = getBot(byTag("artifactJournal", true));
let saveLoad = getBot(byTag("name", "saveload"));

collectionBot.masks.openCollectionID = that;
collectionBot.masks.openCollectionCompletion = masks.collectionsCompletion[that];

collectionBot.masks.items = [];
for (let id of artifactData.tags.collectableIDs[that]){
    collectionBot.masks.items.push(artifactData.tags.userData.collectedArtifacts.find(item => item.id == id)?.state == "collected" ? 2 : 0);
}

thisBot.closeApp();
collectionBot.openApp();