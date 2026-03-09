os.unregisterApp("hudApp");
os.registerApp("hudApp", thisBot);

const App = thisBot.getApp();

os.compileApp("hudApp", <App />)