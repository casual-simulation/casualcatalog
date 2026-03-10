let hide = that ?? true;

getBots(b => {
    let tileSpawner = b.tags.tileProperties ? true : false;
    let tileCopy = b.tags.tileCopy == true;
    let addTileButton = b.tags.system == "msPuzzleExplorer._addTileButton";
    let hiddenTile = b.tags.hiddenTiles == true;

    if(addTileButton){
        hide == true ? setTagMask(b, "home", false, "shared") : setTagMask(b, "home", null, "shared");
    }
    else if(tileSpawner && !tileCopy && !hiddenTile){
        hide == true ? setTagMask(b, "home", false, "shared") : setTagMask(b, "home", null, "shared");
    }

});