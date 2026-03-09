os.unregisterApp("helpApp");
os.registerApp("helpApp", thisBot);

const App = thisBot.getApp();

os.compileApp("helpApp", <App />)