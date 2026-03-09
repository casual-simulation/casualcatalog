let xMod = 0;
let yMod = 0;

const offset = await thisBot.getOffset();

const xMin = -3 + offset.x;
const xMax = 4 + offset.x;
const yMin = -3 + offset.y;
const yMax = 4 + offset.y;

switch (that) {
    case "up":
        tags.homeY < yMax ? yMod = 1 : null;
        break;
    case "down":
        tags.homeY > yMin ? yMod = -1 : null;
        break;
    case "left":
        tags.homeX > xMin ? xMod = -1 : null;
        break;
    case "right":
        tags.homeX < xMax ? xMod = 1 : null;
        break;
}

if(xMod == 0 && yMod == 0){
    return;
}

let targX = tags.homeX + xMod;
let targY = tags.homeY + yMod;

let passable = true;
let touchedBots = [];
let duplicates = [];
getBots(b => {
    if (b.tags.tileCopy) {
        let botX = b.masks.homeX ? b.masks.homeX : b.tags.homeX;
        let botY = b.masks.homeY ? b.masks.homeY : b.tags.homeY;

        if (botX == targX && botY == targY) {
            let tileProperties = getTag(b, "tileProperties");
            tileProperties.passable == true || tileProperties.player == true ? touchedBots.push(b.id) : passable = false;
            let bHeight = getTag(b, "homeZ");
            if(bHeight >= tags.homeZ){
                setTagMask(thisBot, "homeZ", bHeight + 0.01, "shared");
            }

            if(tileProperties.pushable == true && !duplicates.includes(b.id)){
                whisper(b, "touched", thisBot);
                duplicates.push(b.id);
            }
            // tileProperties.pushable == true ? whisper(b, "touched", thisBot) : null;
        }
    }
})

touchedBots = [...new Set(touchedBots)];
whisper(touchedBots, "touched", thisBot);

console.log("touchedBots", touchedBots);

if (passable) {
    tags.touching ? whisper(tags.touching, "left") : null;
    setTagMask(thisBot, "homeX", targX, "shared");
    setTagMask(thisBot, "homeY", targY, "shared");
    setTagMask(thisBot, "touching", touchedBots, "shared");
}