tags.itemName = null;
tags.itemYear = null;
tags.imageSrc = null;
tags.itemInfo = null;
tags.itemCollection = null;
tags.itemInteractive = null;
tags.itemInteractiveLink = null;
tags.itemLink = null;

os.unregisterApp("infoApp");

if (that == "x"){
    let collectionBot = getBot(byTag("name", "collection1"));
    let collectionsMenuBot = getBot(byTag("name", "collectionsMenu"));
    let artifactData = getBot(byTag("name", "artifactData"));
    let saveLoad = getBot(byTag("name", "saveload"));

    collectionBot.masks.openCollectionID = masks.collectionNumber;

    collectionBot.masks.openCollectionCompletion = collectionsMenuBot.masks.collectionsCompletion[masks.collectionNumber];

    collectionBot.masks.items = [];
    for (let id of artifactData.tags.collectableIDs[masks.collectionNumber]){
        collectionBot.masks.items.push(saveLoad.masks.itemSaves[id-1]);
    }
    collectionBot.masks.items = collectionBot.masks.items;

    collectionBot.openApp();
}