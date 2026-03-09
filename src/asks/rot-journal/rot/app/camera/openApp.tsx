os.unregisterApp("cameraApp");
os.registerApp("cameraApp", thisBot);

const App = thisBot.getApp();

os.compileApp("cameraApp", <App />)