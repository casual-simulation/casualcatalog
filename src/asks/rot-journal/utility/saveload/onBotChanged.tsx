if(that.tags.includes("itemSaves")){
    let artifactData = getBot(byTag("name", "artifactData"));
    let collectionsMenu = getBot(byTag("name", "collectionsMenu"));
    let collectionBot = getBot(byTag("name", "collection1"));

    for (let i = 0; i < artifactData.tags.collectableIDs.length; i++){ //i is the index of the collection group [[1,2,3,4,5,6,7,8,9],[11],[12]]
        if (collectionsMenu.masks.collectionsCompletion == null){
            collectionsMenu.masks.collectionsCompletion = [0];
        }
        else if (collectionsMenu.masks.collectionsCompletion[i] == null){
            collectionsMenu.masks.collectionsCompletion.push(0);
        }
        else{
            collectionsMenu.masks.collectionsCompletion[i] = 0;
        }

        for (let id of artifactData.tags.collectableIDs[i]){
            if (masks.itemSaves[id-1] == 2) collectionsMenu.masks.collectionsCompletion[i]++;
        }
        collectionsMenu.masks.collectionsCompletion = collectionsMenu.masks.collectionsCompletion;
    }

    if (collectionBot.masks.openCollectionID != null){
        collectionBot.masks.items = [];
        for (let id of artifactData.tags.collectableIDs[collectionBot.masks.openCollectionID]){
            collectionBot.masks.items.push(masks.itemSaves[id-1]);
        }
        //collectionBot.masks.items = masks.collectionsCompletion[collectionBot.masks.openCollectionID];
        collectionBot.masks.items = collectionBot.masks.items;
    }
}
console.log("saveload")