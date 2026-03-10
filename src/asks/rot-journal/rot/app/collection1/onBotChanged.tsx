if (typeof thisBot.vars.onItemsUpdate === "function"){
    if (masks.items != null) thisBot.vars.onItemsUpdate(masks.items);
}

/*if(that.tags.includes("items")){
    let collectionsMenu = getBot(byTag("name", "collectionsMenu"));
    collectionsMenu.masks.collectionsCompletion[masks.openCollectionID] = masks.items.filter(x => x === 2).length;
    collectionsMenu.masks.collectionsCompletion = collectionsMenu.masks.collectionsCompletion;
}*/

if (typeof thisBot.vars.onCompletionUpdate === "function"){
    if (masks.openCollectionCompletion != null) thisBot.vars.onCompletionUpdate(masks.openCollectionCompletion);
}
console.log("collection1")