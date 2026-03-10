let collectionsMenu = thisBot;
let artifactData = getBot(byTag("artifactJournal", true));

collectionsMenu.masks.collectionsCompletion = [0];
for (let i = 0; i < artifactData.tags.collectableIDs.length; i++){ //i is the index of the collection group [[1,2,3,4,5,6,7,8,9],[11],[12]]
    if (i == 0) collectionsMenu.masks.collectionsCompletion = [0];
    else collectionsMenu.masks.collectionsCompletion.push(0);
}
collectionsMenu.masks.collectionsCompletion = collectionsMenu.masks.collectionsCompletion;