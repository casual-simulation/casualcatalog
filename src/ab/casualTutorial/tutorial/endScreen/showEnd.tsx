// Clean up, just in case
await os.unregisterApp('end')
await os.registerApp('end', thisBot)

const App = thisBot.getApp({sequence: that.sequence})

os.playSound(soundBot.tags.end)

os.compileApp('end',
    <App />
);
