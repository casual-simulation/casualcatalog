await os.registerApp('dialogueApp', thisBot)

const App = thisBot.getApp()

os.compileApp('dialogueApp', 
    <App />
);
