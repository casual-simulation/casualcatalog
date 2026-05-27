if (!links.learn.abIsPrimary()) {
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

const studioId = await superShout("getLayerLoadStudio");
console.log("requestedStudioId", studioId);
if (studioId) {
    await ab.links.search.onLookupABEggs({ recordKey: studioId, abID: "home", autoHatch: true, sourceEvent: 'ask', });
}