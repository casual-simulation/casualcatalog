os.unregisterApp("collectionApp");
os.registerApp("collectionApp", thisBot);

let journal = getBot(byTag("artifactJournal", true));
journal.tags.currentRegisteredApp = "collectionApp";

const App = thisBot.getApp();

os.compileApp("collectionApp", <App />)