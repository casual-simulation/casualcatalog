console.log("initializing after auth")
if (tags.awaitingAuthBot) {
    return;
}

const homeBots = getBots("abIDOrigin", "home");
if (homeBots.length == 0) {
    thisBot.onABInitialized();
}