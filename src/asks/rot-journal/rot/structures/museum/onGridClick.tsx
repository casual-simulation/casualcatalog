if (that.dimension=="map")
{
    let museumBots= getBots(byTag("abIDOrigin","MuseumStructure"))
    if (museumBots.length>0)
    {
        let askExitBot = getBot(byTag("name", "askExit"));
        askExitBot.closeApp();
        askExitBot.openApp();
    }
}