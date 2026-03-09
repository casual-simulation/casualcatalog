let artifactData = getBot(byTag("artifactJournal", true));

thisBot.masks.collectionsCompletion = [0];
for (let i = 0; i < artifactData.tags.collectableIDs.length; i++){ //i is the index of the collection group [[1,2,3,4,5,6,7,8,9],[11],[12]]
    if (i == 0) thisBot.masks.collectionsCompletion = [0];
    else thisBot.masks.collectionsCompletion.push(0);
}

for (let i = 0; i < artifactData.tags.collectableIDs.length; i++){ //i is the index of the collection group [[1,2,3,4,5,6,7,8,9],[11],[12]]
    for (let id of artifactData.tags.collectableIDs[i]){
        if (artifactData.tags.userData.collectedArtifacts.find(item => item.id == id)?.state == "collected") thisBot.masks.collectionsCompletion[i]++;
    }
}

os.unregisterApp("collectionsMenuApp");
os.registerApp("collectionsMenuApp", thisBot);

let hudBot = getBot(byTag("name", "hudMenu"));
hudBot.tags.currentRegisteredApp = "collectionsMenuApp";

const App = thisBot.getApp();

os.compileApp("collectionsMenuApp", <App />);