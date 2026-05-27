console.log("onLayerStudioReturned", that, os.getCurrentInst());

if (os.getCurrentInst() != that.inst) {
    return;
}

if (that.studioId) {
    await ab.links.search.onLookupABEggs({ recordKey: that.studioId, abID: "home", autoHatch: true, sourceEvent: 'ask'});
}