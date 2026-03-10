os.unregisterApp("askEnterLocation");
os.registerApp("askEnterLocation", thisBot);

const App = thisBot.getApp(that);

os.compileApp("askEnterLocation", <App />)