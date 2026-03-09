os.unregisterApp("locationsPopupApp");
os.registerApp("locationsPopupApp", thisBot);

const App = thisBot.getApp();

os.compileApp("locationsPopupApp", <App />)