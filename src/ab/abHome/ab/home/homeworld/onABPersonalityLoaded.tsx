const homeBots = getBots("abIDOrigin", "home");
if (homeBots.length == 0) {
    masks.introPlayed = null;
    await os.sleep(0);
    thisBot.onABInitialized();
}