if (os.getCurrentInst != that.inst) {
    return;
}

if (that) {
    await ab.links.search.onLookupABEggs({ recordKey: that.studioId, abID: "home", autoHatch: true, sourceEvent: 'ask', });
}