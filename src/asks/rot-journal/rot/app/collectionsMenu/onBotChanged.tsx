if (typeof thisBot.vars.onCompletionUpdate === "function"){
    thisBot.vars.onCompletionUpdate(masks.collectionsCompletion);
}

if(that.tags.includes("collectionsCompletion")){
    let collectionBot = getBot(byTag("name", "collection1"));
    if (collectionBot.masks.openCollectionID != null){
        collectionBot.masks.openCollectionCompletion = masks.collectionsCompletion[collectionBot.masks.openCollectionID];
    }
}
console.log("menu")
shout("checkForNewDiscovery")