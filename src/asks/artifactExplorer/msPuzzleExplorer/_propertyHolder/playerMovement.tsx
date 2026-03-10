// console.log(that.keys)

links.playEdit ? null : tags.playEdit = getLink(getBot(byTag("system", "msPuzzleExplorer._playEdit")));

let keyDown = that.keys[0];
let upCheck = keyDown.includes("ArrowUp") || keyDown.toLowerCase() == "w";
let downCheck = keyDown.includes("ArrowDown") || keyDown.toLowerCase() == "s";
let leftCheck = keyDown.includes("ArrowLeft") || keyDown.toLowerCase() == "a";
let rightCheck = keyDown.includes("ArrowRight") || keyDown.toLowerCase() == "d";

const offset = thisBot.getOffset();
const xMin = -3 + offset.x;
const xMax = 4 + offset.x;
const yMin = -3 + offset.y;
const yMax = 4 + offset.y;

if(!tags.playerID){
    links.playEdit.tags.currentPlayer ? tags.playerID = links.playEdit.tags.currentPlayer : null;
}

if (tags.playerTile && tags.mode == "play" && tags.playerID == configBot.id) {
    masks.homeX ? null : setTagMask(thisBot, "homeX", tags.homeX, "shared");
    masks.homeY ? null : setTagMask(thisBot, "homeY", tags.homeY, "shared");

    if (upCheck) {
        masks.homeY < yMax ? thisBot.move("up") : null;
        setTagMask(thisBot, "homeRotationZ", Math.PI, "shared");
        shout("removeEmbed");
    }

    if (downCheck) {
        masks.homeY > yMin ? thisBot.move("down") : null;
        setTagMask(thisBot, "homeRotationZ", 0, "shared");
        shout("removeEmbed");
    }

    if (leftCheck) {
        masks.homeX > xMin ? thisBot.move("left") : null;
        setTagMask(thisBot, "homeRotationZ", -Math.PI/2, "shared");
        shout("removeEmbed");
    }

    if (rightCheck) {
        masks.homeX < xMax ? thisBot.move("right") : null;
        setTagMask(thisBot, "homeRotationZ", Math.PI/2, "shared");
        shout("removeEmbed");
    }

    shout("playerMoved");
}