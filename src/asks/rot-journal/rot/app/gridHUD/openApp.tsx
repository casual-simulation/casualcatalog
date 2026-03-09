os.unregisterApp("gridHUDApp");
os.registerApp("gridHUDApp", thisBot);

const App = thisBot.getApp();

os.compileApp("gridHUDApp", <App />)