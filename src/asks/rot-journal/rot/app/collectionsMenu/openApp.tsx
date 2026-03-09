os.unregisterApp("collectionsMenuApp");
os.registerApp("collectionsMenuApp", thisBot);

const App = thisBot.getApp();

os.compileApp("collectionsMenuApp", <App />);