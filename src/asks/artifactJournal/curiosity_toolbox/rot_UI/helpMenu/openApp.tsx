let journal = getBot(byTag("artifactJournal", true));
os.unregisterApp(journal.tags.currentRegisteredApp ?? "helpApp");

journal.tags.currentRegisteredApp = "helpApp";
os.registerApp("helpApp", thisBot);

const App = thisBot.getApp();

os.compileApp("helpApp", <App />)