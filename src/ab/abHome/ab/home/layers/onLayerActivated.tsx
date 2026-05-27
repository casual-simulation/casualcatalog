console.log("onLayerActivated", JSON.stringify(that), os.getCurrentInst(), links.learn.abIsPrimary())

if (!links.learn.abIsPrimary()) {
    superShout("getLayerLoadStudio", os.getCurrentInst());
    return;
}

if (!tags.activeInsts) {
    setTagMask(thisBot, "activeInsts", []);
}

console.log("layerActive", JSON.stringify(that))
if (!tags.activeInsts.includes(that)) {
    masks.activeInsts.push(that);

    thisBot.updateLayersMenuDropdown();
}