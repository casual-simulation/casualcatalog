if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] inst: ${os.getCurrentInst()}, getLayerLoadStudio that:`, that);
}

if (!links.learn.abIsPrimary()) {
    return;
}

const studioId = tags.currLayerStudio;
masks.currLayerStudio = null;

superShout("onLayerStudioReturned", {studioId: studioId, inst: that});