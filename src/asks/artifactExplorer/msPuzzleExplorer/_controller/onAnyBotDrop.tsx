const draggedBot = that.bot;
const remotes = await os.remotes();
const tileProperties = getTag(draggedBot, "tileProperties");

let copyType, copyTag, maxCopies, maxCopiesMessage;
let offset = await thisBot.getOffset();

if (tileProperties) {
    copyType = tileProperties.tileType;
    copyTag = copyType + "Copy";
    maxCopies = tileProperties.copiesPerPlayer ? remotes.length * tileProperties.copiesPerPlayer : tileProperties.maxCopies ? tileProperties.maxCopies : null;
    maxCopiesMessage = tileProperties.maxCopiesMessage;
}
else {
    copyType = null;
    copyTag = null;
    maxCopies = null;
    maxCopiesMessage = null;
}

const fromX = Math.round(that.from.x * 100)/100;
const fromY = Math.round(that.from.y * 100)/100;
const toX = Math.round(that.to.x * 100)/100;
const toY = Math.round(that.to.y * 100)/100;

console.log(`fromX: ${that.from.x}, fromY: ${that.from.y}`);

const xMin = -3 + offset.x;
const xMax = 4 + offset.x;
const yMin = -3 + offset.y;
const yMax = 4 + offset.y

const copyCheck = !getTag(draggedBot, "copyType");
const coordCheck = (toX >= xMin && toX <= xMax) && (toY >= yMin && toY <= yMax);
// const botCheck = !that.to.bot ? true : !that.to.bot.tags.tileProperties ? false : that.to.bot.tags.tileProperties.ground == true ? true : false;

let botCheck, vertOffset;
if(!that.to.bot){ botCheck = true; }
else if(!that.to.bot.tags.tileProperties){ botCheck = false; }
else if(that.to.bot.tags.tileProperties.ground == true){ botCheck = true; vertOffset = that.to.bot.tags.homeZ + 0.01 ?? 0.01; }
else { botCheck = false; }

console.log("bot check: ", botCheck)


if (copyCheck && copyType) {
    setTag(draggedBot, "homeX", fromX);
    setTag(draggedBot, "homeY", fromY);

    if (coordCheck && botCheck && tags.mode == "edit") {
        if (maxCopies) {
            let pieceCopies = getBots(byTag(copyTag, true));

            if (pieceCopies.length >= maxCopies) {
                os.toast(maxCopiesMessage);
            }
            else {
                thisBot.spawnTileCopy({
                    tile: draggedBot,
                    position: {
                        x: toX,
                        y: toY,
                        z: vertOffset ?? null
                    },
                    extraMods: that.extraMods
                })
            }
        }
        else {
            thisBot.spawnTileCopy({
                tile: draggedBot,
                position: {
                    x: toX,
                    y: toY,
                    z: vertOffset ?? null
                },
                extraMods: that.extraMods
            })
        }
    }
}