/*if (getBot("playerID", configBot.id)) { return }
if (configBot.tags.systemPortal !== undefined) { return }

console.log("[RoT] Creating player...")
let xLoc = -85.67668600;
let yLoc = 42.96540000;

const mapDimension = globalThis.mapDimension ?? 'map';
const playerTemplate = getBot("system", "rot.templates.player");
if (!playerTemplate) { os.sleep(500).then(() => { whisper(thisBot, 'onInit') }) }
const playerData = { ...playerTemplate.tags }
playerData["space"] = "tempShared";
playerData[mapDimension] = true;
playerData[`${mapDimension}X`] = xLoc;
playerData[`${mapDimension}Y`] = yLoc;
playerData["system"] = `rot.players.${configBot.id}`;
playerData["playerID"] = configBot.id;

console.log("[RoT] Made player object")

const playerBot = create(playerData)

console.log("[RoT] Created player bot", playerBot)

// starts the location updater
whisper(playerBot, "locationLoop")

await os.focusOn({x: xLoc, y: yLoc}, {
    portal: 'map',
    zoom: 3000,
    rotation: {
        x: Math.PI / 3,
        y: - Math.PI / 4,
    },
})

console.log("[RoT] Focused player")
*/