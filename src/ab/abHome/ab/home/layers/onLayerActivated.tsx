if (!links.homeworld.isInPrimary()) {
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