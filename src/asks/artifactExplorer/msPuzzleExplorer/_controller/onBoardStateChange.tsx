if(that == "play"){
    tags.mode = "play";
    tags.gameStart ? thisBot.gameStart() : null;
    // tags.setCameraVariables ? thisBot.setCameraVariables({ skipWait: true, xPos: 0.5, yPos: -1.25, zoom: 18 }) : null;
    tags.setCameraVariables ? thisBot.setCameraVariables({ skipWait: true, xPos: 0.5, yPos: -1.25 }) : null;
    tags.hideTileSpawners ? thisBot.hideTileSpawners() : null;
    tags.setEmbedsMask ? thisBot.setEmbedsMask() : null;
}
else if(that == "edit"){
    tags.mode = "edit";
    tags.gameEnd ? thisBot.gameEnd() : null;
    tags.setCameraVariables ? thisBot.setCameraVariables({ skipWait: true }) : null;
    tags.hideTileSpawners ? thisBot.hideTileSpawners(false) : null;
    tags.setEmbedsMask ? clearTagMasks(thisBot) : null;
}