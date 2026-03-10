const {
    tile,
    position,
    extraMods
} = that;

const tileProperties = getTag(tile, "tileProperties");

let copyType, copyTag;

copyType = tileProperties.tileType;
copyTag = copyType + "Copy";

let copyMods = {
    homeX: position.x,
    homeY: position.y,
    homeZ: position.z ?? 0,
    boardOffset: { 
        x: position.x - (links.gameBoard.tags.homeX), 
        y: position.y - (links.gameBoard.tags.homeY)
    },
    system: "pieceCopies." + copyTag,
    label: tile.tags.formAddress ? null : tile.tags.label,
    [copyTag]: true,
    copyType: copyType,
    tileCopy: true,
    mode: tags.mode,
    onBoardStateChange: tags.onBoardStateChange,
    resetBoardCopies: `@ clearTagMasks(thisBot); masks.homeX = null; masks.homeY = null;`,
    clearBoardCopies: `@ destroy(thisBot);`,
    onDrag: tags.tileCopyDrag,
    onDrop: tags.tileCopyDrop,
    // onClick: tags.tileCopyClicked,
    gameBoard: tags.gameBoard,
    getOffset: tags.getOffset,
    resetBoardTilePositions: tags.resetTilePosition
}

const propsToGet = [];

tileProperties.player == true ? propsToGet.push("player") : null;
tileProperties.lock == true ? propsToGet.push("lock") : null;
tileProperties.key == true ? propsToGet.push("key") : null;
tileProperties.winTile == true ? propsToGet.push("winTile") : null;
tileProperties.moveUpDown == true ? propsToGet.push("moveUpDown") : null;
tileProperties.moveLeftRight == true ? propsToGet.push("moveLeftRight") : null;
tileProperties.harmful == true ? propsToGet.push("harmful") : null;
tileProperties.playerSpawnpoint == true ? propsToGet.push("playerSpawnpoint") : null;
tileProperties.collectable == true ? propsToGet.push("collectable") : null;
tileProperties.paired == true ? propsToGet.push("paired") : null;
tileProperties.teleporter == true ? propsToGet.push("teleporter") : null;
tileProperties.pressurePlate == true ? propsToGet.push("pressurePlate") : null;
tileProperties.pressureDoor == true ? propsToGet.push("pressureDoor") : null;
tileProperties.pushable == true ? propsToGet.push("pushable") : null;

const tileFunctions = links.propertyHolder._getTileFunctions(propsToGet);

console.log("tileFunctions:", tileFunctions)

for (const tag in tileFunctions.tagsToAdd) {
    copyMods[tag] = tileFunctions.tagsToAdd[tag];
}
tileFunctions.gameStart.length > 0 ? copyMods.gameStart = `@` + tileFunctions.gameStart.join("\n") : null;
tileFunctions.gameEnd.length > 0 ? copyMods.gameEnd = `@` + tileFunctions.gameEnd.join("\n") : null;
tileFunctions.touched.length > 0 ? copyMods.touched = `@` + tileFunctions.touched.join("\n") : null;
tileFunctions.left.length > 0 ? copyMods.left = `@` + tileFunctions.left.join("\n") : null;
tileFunctions.levelComplete.length > 0 ? copyMods.levelComplete = `@` + tileFunctions.levelComplete.join("\n") : null;

let animationIdleStartString = `\n if(tags.animationIdle){ os.startFormAnimation(thisBot, tags.animationIdle, { loop: true }) };`;
let animationIdleStopString = `\n if(tags.animationIdle){ os.stopFormAnimation(thisBot) };`;

console.log(copyMods.gameStart)

copyMods.gameStart ? copyMods.gameStart += animationIdleStartString : copyMods.gameStart = `@ ` + animationIdleStartString;
copyMods.gameEnd ? copyMods.gameEnd += animationIdleStopString : copyMods.gameEnd = `@ ` + animationIdleStopString;

console.log(copyMods.gameStart)

if (extraMods) {
    for (const mod in extraMods) {
        copyMods[mod] = extraMods[mod];
    }
}

create(tile, copyMods);

console.log("copyMods: ", copyMods);