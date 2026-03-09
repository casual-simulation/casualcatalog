os.unregisterApp("collectionApp");
os.registerApp("collectionApp", thisBot);

const App = thisBot.getApp();

// spawns the collection of artifacts that we clicked on
/*
let artifactSpawner = getBot("#system", "rot.artifactSpawner")
artifactSpawner.spawnArtifactGroup({
    artifactVisualData: tags.artifactInfo,
    artifactLocationData: tags.artifactLocationData
})
*/
os.compileApp("collectionApp", <App />)