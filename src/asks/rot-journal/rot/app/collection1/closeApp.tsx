masks.openCollectionID = null;
masks.openCollectionCompletion = null;
masks.items = null;

os.unregisterApp("collectionApp");

if (that == "x"){
    let collectionsBot = getBot(byTag("name", "collectionsMenu"));
    collectionsBot.openApp();
}