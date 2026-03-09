os.unregisterApp("landmarkApp");
os.registerApp("landmarkApp", thisBot);

const App = thisBot.getApp();

os.compileApp("landmarkApp", <App />)