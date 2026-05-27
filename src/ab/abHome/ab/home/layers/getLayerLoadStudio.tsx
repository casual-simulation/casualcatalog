os.toast(`getLayerLoadStudio, ${tags.currLayerStudio}, ${os.getCurrentInst()}, ${that}`);

if (!links.learn.abIsPrimary()) {
    return;
}

const studioId = tags.currLayerStudio;
masks.currLayerStudio = null;

superShout("onLayerStudioReturned", {studioId: studioId, inst: that});