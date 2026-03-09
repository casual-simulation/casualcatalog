// os.unregisterApp("locationApp");
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

let hudBot = getBot(byTag("name", "hudMenu"));
hudBot.tags.currentRegisteredApp = "locationApp";

const App = thisBot.getApp(menu);

os.compileApp("locationApp", <App />)