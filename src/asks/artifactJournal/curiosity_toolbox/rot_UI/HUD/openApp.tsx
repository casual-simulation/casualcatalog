os.unregisterApp("hudApp");
os.registerApp("hudApp", thisBot);

tags.currentRegisteredApp = "hudApp";

const App = thisBot.getApp();

os.compileApp("hudApp", <App />)