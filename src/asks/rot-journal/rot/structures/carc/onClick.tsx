let playerBot= getBot(byTag("playerID"))
if (playerBot.tags.map===true) 
{
    let askEnterBot = getBot(byTag("name", "askEnter"));
    askEnterBot.closeApp();
    askEnterBot.openApp(tags.name);
}