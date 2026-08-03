let journal = getBot(byTag("artifactJournal", true));
os.unregisterApp(journal.tags.currentRegisteredApp ?? "locationApp");

journal.tags.currentRegisteredApp = "locationApp";
os.registerApp("locationApp", thisBot);

console.log("[RoT] Opening App: " + that)

os.focusOn(ab.links.manifestation.links.abBot, {
    portal: 'map',
    duration: .5 * 3,
    rotation: {x: 45, y: 45},
    easing: {
        type: "quadratic",
        mode: "inout"
        }
})

let menu = that

const App = thisBot.getApp(menu);

os.compileApp("locationApp", <App />)