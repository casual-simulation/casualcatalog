let journal = getBot(byTag("artifactJournal", true));
os.unregisterApp(journal.tags.currentRegisteredApp ?? "collectionApp");

journal.tags.currentRegisteredApp = "collectionApp";
os.registerApp("collectionApp", thisBot);

const App = thisBot.getApp();

os.compileApp("collectionApp", <App />)