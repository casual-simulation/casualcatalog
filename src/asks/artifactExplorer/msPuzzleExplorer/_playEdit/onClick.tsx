// let gridImage = "https://brandplayer-prod-filesbucket-458964701190.s3.amazonaws.com/msUtilityFiles/961138f91bfe34c4e72836cd19b55b8eadac3925db83bd8e376b995e516958ca.png";

if (tags.label == "Play") {

    const playerBots = [];
    const winBots = [];

    getBots(b => {
        let playerTileCheck = b.tags.playerTile == true ? true : false;
        let countAsPLayerCheck = b.tags.countAsPlayer == true ? true : false;
        let winTileCheck = b.tags.winTile == true ? true : false;

        if (playerTileCheck || countAsPLayerCheck) {
            playerBots.push(b);
        }
        if (winTileCheck) {
            winBots.push(b);
        }
    })

    if (playerBots.length > 0 && winBots.length > 0) {
        let remotes = await os.remotes();

        if (playerBots.length > remotes.length) {
            os.toast("Not enough players.")
        }
        else if (winBots.length > playerBots.length) {
            os.toast("Too many goals. Max of 1 per player.")
        }
        else {
            shout("onBoardStateChange", "play");
            if (!ab.links.console.masks.open) {
                whisper(ab.links.console, "showConsole");
                ab.links.console.masks.open = true;
            }
            ab.log("A brave whale started on an adventure.")
            await os.sleep(100);
            shout("setCurrentPlayer", configBot.id);
        }
    }
    else {
        os.toast("At least 1 player and 1 goal needed.");
    }
}
else if (tags.label == "Edit") {
    shout("onBoardStateChange", "edit");
    if (!ab.links.console.masks.open) {
        whisper(ab.links.console, "showConsole");
        ab.links.console.masks.open = true;
    }
    ab.log("The whale ended their adventure early.")
}