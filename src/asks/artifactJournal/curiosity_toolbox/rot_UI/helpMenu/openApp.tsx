os.unregisterApp("helpApp");
os.registerApp("helpApp", thisBot);

let journal = getBot(byTag("artifactJournal", true));
journal.tags.currentRegisteredApp = "helpApp";

const App = thisBot.getApp();

os.compileApp("helpApp", <App />)