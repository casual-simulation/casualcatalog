let journal = getBot(byTag("artifactJournal", true));
os.unregisterApp(journal.tags.currentRegisteredApp ?? "locationApp");

journal.tags.currentRegisteredApp = "locationApp";
os.registerApp("locationApp", thisBot);

console.log("[RoT] Opening App: " + that)
const avatarBot = getBot(byTag("mapAvatar", true), byTag("ownerID", authBot?.id));
if (avatarBot) {
    os.focusOn(avatarBot, {
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