let infoBot = getBot(byTag("openedInst"));
if (infoBot.tags.openedInst != null){
    superShout("closeMiniGrid");

    let sideUnloadInst = getBot(byTag("name", "sideUnloadInst"));
    sideUnloadInst.unloadNoInput(infoBot.tags.openedInst);
    //sideUnloadInst.onClick();

    //Wake up the main inst's ab1
    let sleepControl = getBot(byTag("abAwakeState"));
    sleepControl.tags.abAwakeState = true;
    
    infoBot.tags.openedInst = null;
    configBot.tags.miniGridPortal = null;
    thisBot.closeApp();

    let hudBot = getBot(byTag("name", "hudBot"));
    hudBot.openApp();
}