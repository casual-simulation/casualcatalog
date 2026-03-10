let instName = tags.itemCollection + "-" + tags.itemName;

if (tags.openedInst != null){
    superShout("closeMiniGrid");
    
    let sideUnloadInst = getBot(byTag("name", "sideUnloadInst"));
    sideUnloadInst.unloadNoInput(tags.openedInst);
    //sideUnloadInst.onClick();
}

if (tags.openedInst == instName){
    tags.openedInst = null;
    configBot.tags.miniGridPortal = null;

    let miniGridHudBot = getBot(byTag("name", "miniGridHudBot"));
    miniGridHudBot.closeApp();
}
else{
    os.toast("Launching Interactive");
    
    thisBot.closeApp();

    let debugBot = getBot(byTag("name", "debugMenu"));
    if (debugBot.masks.isOpen == true) debugBot.closeApp();

    if (!authBot?.id){ //If not logged in, need to store extra info
        shout("tempSave");
    }

    //Put the main inst's ab1 to sleep
    let sleepControl = getBot(byTag("abAwakeState"));
    sleepControl.tags.abAwakeState = false;

    let sideLoadInst = getBot(byTag("name", "sideLoadInst"));
    sideLoadInst.loadNoInput([instName, instName]); //[<name of inst to load>, <name of pattern to load the inst with (/ an egg to hatch)>]
    /*if (tags.itemInteractiveLink != null) sideLoadInst.loadNoInput([instName, instName]);
    else{
        sideLoadInst.loadNoInput([instName, null]);
    }*/


    tags.openedInst = instName;

    /*miniGridPortalBot.tags.miniPortalHeight = 1; //.5;
    miniGridPortalBot.tags.miniPortalResizable = false;
    //miniGridPortalBot.tags.portalZoomable = false;
    //miniGridPortalBot.tags.portalRotatable = false;

    //configBot.tags.miniGridPortal = instName;
    configBot.tags.miniGridPortal = "sideLoad";

    let miniGridHudBot = getBot(byTag("name", "miniGridHudBot"));
    miniGridHudBot.openApp();*/
}