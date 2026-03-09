os.unregisterApp("collectionApp");
os.registerApp("collectionApp", thisBot);

let hudBot = getBot(byTag("name", "hudMenu"));
hudBot.tags.currentRegisteredApp = "collectionApp";

const App = thisBot.getApp();

os.compileApp("collectionApp", <App />)