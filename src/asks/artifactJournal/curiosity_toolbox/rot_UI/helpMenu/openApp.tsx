os.unregisterApp("helpApp");
os.registerApp("helpApp", thisBot);

let hudBot = getBot(byTag("name", "hudMenu"));
hudBot.tags.currentRegisteredApp = "helpApp";

const App = thisBot.getApp();

os.compileApp("helpApp", <App />)