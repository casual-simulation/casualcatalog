console.log("rested", configBot.tags.placeAsk, tags.pageInitialized);
if (!tags.pageInitialized) {
    tags.pageInitialized = true;
    thisBot.setupPage()
}