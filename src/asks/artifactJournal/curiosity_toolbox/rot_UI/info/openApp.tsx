os.unregisterApp("infoApp");
os.registerApp("infoApp", thisBot);

masks.collectionNumber = that;

let journal = getBot(byTag("artifactJournal", true));
journal.tags.currentRegisteredApp = "infoApp";

const App = thisBot.getApp();

os.compileApp("infoApp", <App />)