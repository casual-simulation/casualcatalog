os.unregisterApp("infoApp");
os.registerApp("infoApp", thisBot);

masks.collectionNumber = that;

let hudBot = getBot(byTag("name", "hudMenu"));
hudBot.tags.currentRegisteredApp = "infoApp";

const App = thisBot.getApp();

os.compileApp("infoApp", <App />)