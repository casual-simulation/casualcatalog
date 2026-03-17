let journal = getBot(byTag("artifactJournal", true));
os.unregisterApp(journal.tags.currentRegisteredApp ?? "infoApp");

journal.tags.currentRegisteredApp = "infoApp";
os.registerApp("infoApp", thisBot);

masks.collectionNumber = that;

const App = thisBot.getApp();

os.compileApp("infoApp", <App />)