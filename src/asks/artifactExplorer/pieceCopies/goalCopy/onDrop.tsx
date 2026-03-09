const fromX = Math.round(that.from.x * 100) / 100;
const fromY = Math.round(that.from.y * 100) / 100;
const toX = Math.round(that.to.x * 100) / 100;
const toY = Math.round(that.to.y * 100) / 100;

const offset = await thisBot.getOffset();

const xMin = -3 + offset.x;
const xMax = 4 + offset.x;
const yMin = -3 + offset.y;
const yMax = 4 + offset.y;

const coordCheck = (toX >= xMin && toX <= xMax) && (toY >= yMin && toY <= yMax);
// const botCheck = !that.to.bot ? true : !that.to.bot.tags.tileProperties ? false : that.to.bot.tags.tileProperties.ground == true ? true : false;
const draggedBotCheck = that.dragBot.id == thisBot.id;
const playCheck = tags.mode == "edit";

let botCheck, vertOffset;
if (!that.to.bot) { botCheck = true; }
else if (!that.to.bot.tags.tileProperties) { botCheck = false; }
else if (that.to.bot.tags.tileProperties.ground == true) { botCheck = true; vertOffset = that.to.bot.tags.homeZ + 0.01 ?? 0.01; }
else { botCheck = false; }

if (draggedBotCheck) {
    if (playCheck) {
        if (coordCheck) {
            if (botCheck) {
                moveTileCopy("move");
            }
            else {
                moveTileCopy("stay");
            }
        }
        else if (tags.system == "pieceCopies.goalCopy" || tags.system == "pieceCopies.spawnPointCopy") {
            moveTileCopy("stay");
        }
        else {
            destroy(thisBot);
        }
    }
    else {
        moveTileCopy("stay");
    }
}

function moveTileCopy(toFrom) {
    let posX, posY;

    if(toFrom == "move"){
        posX = toX;
        posY = toY;
    }
    else if (toFrom == "stay"){
        posX = fromX;
        posY = fromY;
    }
    else {
        posX = fromX;
        posY = fromY;
    }

    tags.homeX = posX;
    tags.homeY = posY;
    tags.boardOffset = {
        x: posX - links.gameBoard.tags.homeX,
        y: posY - links.gameBoard.tags.homeY
    }
}