tags.lock ? thisBot.lock() : null; 
tags.moveAllowed ? setTagMask(thisBot, "moveAllowed", false, "shared") : null;
tags.toggleAsset ? setTagMask(thisBot, "formAddress", tags.toggleAsset, "shared") : setTagMask(thisBot, "home", false, "shared");
// setTagMask(thisBot, "touched", "@", "shared");

// setTagMask(thisBot, "homeX", 99, "shared");
// setTagMask(thisBot, "homeY", 99, "shared");

let tempProps = tags.tileProperties; 
tempProps.passable = true; 
setTagMask(thisBot, "tileProperties", tempProps, "shared");