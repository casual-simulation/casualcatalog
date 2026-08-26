//shoot out arm
const dimension = configBot.tags.mapPortal ?? configBot.tags.gridPortal;
const inMap = configBot.tags.mapPortal ? true : false;

const abBot = ab.links.manifestation.links.abBot;
let posX = abBot.tags[dimension + 'X'] + (inMap ? .002 : 2);
let posY = abBot.tags[dimension + 'Y'];

const armBot = ab.links.arm_tool.abCreateArm({
        originBot: ab.links.manifestation.links.abBot,
        dimension: dimension,
        position: {
            x: posX,
            y: posY
        },
    })

await ab.links.menu.abOpenMenu("grid");

await os.sleep(0)

//parse the request
const result = that.replace(/^\d+\.\s*<ask>\s*/, "");

//prefill ask box
const inputBox = getBot("abAskInputBox", true);
console.log(inputBox)
if (inputBox) {
    inputBox.masks.menuItemText = result;
}