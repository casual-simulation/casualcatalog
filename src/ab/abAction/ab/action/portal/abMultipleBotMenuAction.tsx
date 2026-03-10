const currentInst = os.getCurrentInst();
const multipleSelectDim = "abMultipleSelect";

configBot.tags.sheetPortal = multipleSelectDim;

setTagMask(links.remember.links.abMultipleBotFocus, multipleSelectDim, true, "tempLocal");

masks.currentSheetBots = links.remember.tags.abMultipleBotFocus;
masks.onPortalChanged = ListenerString(() => {
    if (that.dimension != "abMultipleSelect" && that.portal == "sheetPortal") {
        clearTagMasks(links.currentSheetBots);
        clearTagMasks(thisBot);
    }
});

ab.log(links.personality.tags.abBuilderIdentity + ": opened multiple select sheet");