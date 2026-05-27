os.toast(`onLayerStudioReturned, ${os.getCurrentInst()}, ${that}`);

if (os.getCurrentInst() != that.inst) {
    return;
}

if (that.studioId) {
    await ab.links.search.onLookupABEggs({ recordKey: that.studioId, abID: "home", autoHatch: true, sourceEvent: 'ask'});
}