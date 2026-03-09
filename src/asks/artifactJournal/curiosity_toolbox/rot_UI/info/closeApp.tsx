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
    let collectionBot = getBot(byTag("name", "collectionMenu"));
    let collectionsMenuBot = getBot(byTag("name", "collectionsMenu"));
    let artifactData = getBot(byTag("artifactJournal", true));

    collectionBot.masks.openCollectionID = masks.collectionNumber;

    collectionBot.masks.openCollectionCompletion = collectionsMenuBot.masks.collectionsCompletion[masks.collectionNumber];

    collectionBot.masks.items = [];
    for (let id of artifactData.tags.collectableIDs[masks.collectionNumber]){
        collectionBot.masks.items.push(artifactData.tags.userData.collectedArtifacts.find(item => item.id == id)?.state == "collected" ? 2 : 0);
    }
    collectionBot.masks.items = collectionBot.masks.items;

    collectionBot.openApp();
}