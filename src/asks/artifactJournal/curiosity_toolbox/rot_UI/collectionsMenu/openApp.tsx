let artifactData = getBot(byTag("artifactJournal", true));

os.unregisterApp(artifactData.tags.currentRegisteredApp ?? "collectionsMenuApp");

artifactData.tags.currentRegisteredApp = "collectionsMenuApp";
os.registerApp("collectionsMenuApp", thisBot);

const App = thisBot.getApp();

os.compileApp("collectionsMenuApp", <App />);