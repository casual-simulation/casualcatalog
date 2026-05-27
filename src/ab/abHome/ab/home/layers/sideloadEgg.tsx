const curInst = os.getCurrentInst();
if (that.inst == curInst) {
    await ab.links.search.onLookupABEggs({ recordKey: that.record, abID: that.ask, autoHatch: true, sourceEvent: 'ask', });
}