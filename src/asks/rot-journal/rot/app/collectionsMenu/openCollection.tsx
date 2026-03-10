//let collectionBot = getBot(byTag("name", "collection" + that));
let collectionBot = getBot(byTag("name", "collection1"));
let artifactData = getBot(byTag("name", "artifactData"));
let saveLoad = getBot(byTag("name", "saveload"));

collectionBot.masks.openCollectionID = that;
collectionBot.masks.openCollectionCompletion = masks.collectionsCompletion[that];

collectionBot.masks.items = [];
for (let id of artifactData.tags.collectableIDs[that]){
    collectionBot.masks.items.push(saveLoad.masks.itemSaves[id-1]);
}
collectionBot.masks.items = collectionBot.masks.items;

thisBot.closeApp();
collectionBot.openApp();