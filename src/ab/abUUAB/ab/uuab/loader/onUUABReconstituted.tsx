if (that.tags.uuabName == tags.currentLoadingUUAB) {

    //Pull in uuab mod pattern
    if (that.tags.defaultPattern) {
        await links.search.onLookupABEggs({ abID: that.tags.defaultPattern, recordKey: that.tags.defaultPatternStudio ?? null, autoHatch: true, sourceEvent: 'ask'});
    }

    that.onUUABLoaded();

    if (tags.destroyUUABOnLoad) {
        destroy(that);
    }
}