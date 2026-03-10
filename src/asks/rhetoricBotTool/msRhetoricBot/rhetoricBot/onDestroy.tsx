shout("resetRBMenu");

let rhetoricBots = getBots(byTag("system", "msRhetoricBot.rhetoricBot"));
if(rhetoricBots.length < 2){
    let forceGraphBots = getBots(byTag("fgTool", true));
    destroy(forceGraphBots);
}