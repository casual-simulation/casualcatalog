setTagMask(thisBot, "currentLoadingUUAB", that, "local");

//Pull in uuab aux
const ask = await ab.links.search.onLookupAskID({
    askID: that,
    sourceEvent: 'ask',
    autoHatch: true,
    isUUAB: true
})

if (ask.success) {
    console.log("[abUUAB]: Loaded uuab", ask);
} else {
    console.log("[abUUAB]: Failed to load uuab", ask);
}