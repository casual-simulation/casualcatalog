let collectables = getBots(byTag("collectableTile", true), byTag("tileCopy", true)); 

if(collectables.length > 0){
    setTagMask(thisBot, "ignoreTouch", true, "shared");
    setTagMask(thisBot, "color", "grey", "shared");
}