if (tags.awaitingAuthBot) {
    return;
}

const homeBots = getBots("abIDOrigin", "home");
if (homeBots.length == 0) {
    thisBot.init();
}