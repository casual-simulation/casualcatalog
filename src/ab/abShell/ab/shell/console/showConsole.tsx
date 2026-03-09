if (masks.open) { return };

configBot.masks.tagPortal = null;
configBot.masks.tagPortalSpace = null;

// Unregister in case it was already open
var currentVer = masks.consoleVersion ?? 0;
await os.unregisterApp(`ab-console-${currentVer}`);

currentVer += 1;
masks.consoleVersion = currentVer;
// Get, register, and compile the app
const App = thisBot.getApp();
await os.registerApp(`ab-console-${currentVer}`, thisBot);
os.compileApp(`ab-console-${currentVer}`, <App />);
masks.open = true;
