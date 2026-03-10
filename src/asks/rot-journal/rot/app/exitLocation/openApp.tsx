os.unregisterApp("askExitLocation");
os.registerApp("askExitLocation", thisBot);

const App = thisBot.getApp();

os.compileApp("askExitLocation", <App />)