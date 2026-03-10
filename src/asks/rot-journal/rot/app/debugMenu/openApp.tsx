os.unregisterApp("debugApp");
os.registerApp("debugApp", thisBot);

masks.isOpen = true;

const App = thisBot.getApp();

os.compileApp("debugApp", <App />)