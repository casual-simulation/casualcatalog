os.unregisterApp("miniGridHudApp");
os.registerApp("miniGridHudApp", thisBot);

const App = thisBot.getApp();

os.compileApp("miniGridHudApp", <App />)