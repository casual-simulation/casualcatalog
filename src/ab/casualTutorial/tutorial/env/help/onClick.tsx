// Clean up, just in case
await os.unregisterApp('help')
await os.registerApp('help', thisBot)

const App = thisBot.getApp()

os.compileApp('help',
    <App />
);
