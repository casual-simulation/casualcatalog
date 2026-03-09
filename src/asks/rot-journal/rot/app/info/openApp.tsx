os.unregisterApp("infoApp");
os.registerApp("infoApp", thisBot);

masks.collectionNumber = that;

const App = thisBot.getApp();

os.compileApp("infoApp", <App />)