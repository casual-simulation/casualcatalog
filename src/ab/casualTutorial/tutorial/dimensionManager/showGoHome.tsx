// Clean up, just in case
await os.unregisterApp('goHome')
await os.registerApp('goHome', thisBot)

const App = thisBot.getApp()

os.compileApp('goHome',
    <App />
);
