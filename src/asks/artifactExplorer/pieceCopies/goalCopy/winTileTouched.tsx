let playerTile = getTag(that, "playerTile");

if (playerTile == true && tags.ignoreTouch == false) {
    whisper(that, "lock");

    let tempTileProperties = tags.tileProperties;
    tempTileProperties.reached = true;
    setTagMask(thisBot, "tileProperties", tempTileProperties, "shared");

    let winTiles = {
        reached: [],
        remaining: []
    };

    getBots(b => {
        let tileProperties = b.tags.tileProperties;
        if (tileProperties) {
            if (tileProperties.winTile == true && b.tags.tileCopy == true) {
                tileProperties.reached == true ? winTiles.reached.push(b) : winTiles.remaining.push(b);
            }
        }
    })

    let remainingGoals = winTiles.remaining.length;

    if (remainingGoals == 0) {
        ab.log("Finally, the whale found their way to their destination, before setting off on another fun adventure.")
        shout("doSharedAction", { actionType: "playSound", actionData: "levelComplete" });
        // shout("doSharedAction", { actionType: "showMessage", actionData: "Level Complete!" });
        shout("levelCompleteMessage");
        shout("levelComplete");
        // shout("restartPuzzle");
    }
    else {
        shout("doSharedAction", { actionType: "playSound", actionData: "goalReached" });
        shout("doSharedAction", { actionType: "showToast", actionData: `Goal collected! Only ${remainingGoals} more to go!` });
    }
}