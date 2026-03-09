// os.unregisterApp("locationApp");
os.registerApp("locationApp", thisBot);

console.log("[RoT] Opening App: " + that)
let playerBot=getBot(byTag("playerID"))
os.focusOn(playerBot, {
    portal: 'map',
    duration: .5 * 3,
    easing: {
        type: "quadratic",
        mode: "inout"
        }
})
let menu = that
const App = thisBot.getApp(menu);

os.compileApp("locationApp", <App />)