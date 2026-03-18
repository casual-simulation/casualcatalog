let journal = getBot(byTag("artifactJournal", true));
os.unregisterApp(journal.tags.currentRegisteredApp ?? "locationApp");

journal.tags.currentRegisteredApp = "locationApp";
os.registerApp("locationApp", thisBot);

console.log("[RoT] Opening App: " + that)
const playerBot = getBot(byTag("simAvatar", true), byTag("remoteID", configBot.tags.id));
if (playerBot) {
    os.focusOn(playerBot, {
        portal: 'map',
        duration: .5 * 3,
        easing: {
            type: "quadratic",
            mode: "inout"
            }
    })
}

let menu = that

const App = thisBot.getApp(menu);

os.compileApp("locationApp", <App />)