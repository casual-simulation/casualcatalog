// let instName = tags.itemCollection + "-" + tags.itemName;

// if (tags.openedInst != null){
//     superShout("closeMiniGrid");
    
//     let sideUnloadInst = getBot(byTag("name", "sideUnloadInst"));
//     sideUnloadInst.unloadNoInput(tags.openedInst);
// }

// if (tags.openedInst == instName){
//     tags.openedInst = null;
//     configBot.tags.miniGridPortal = null;

//     let miniGridHudBot = getBot(byTag("name", "miniGridHudBot"));
//     miniGridHudBot.closeApp();
// }
// else{
//     os.toast("Launching Interactive");
    
//     thisBot.closeApp();

//     //Put the main inst's ab1 to sleep
//     let sleepControl = getBot(byTag("abAwakeState"));
//     sleepControl.tags.abAwakeState = false;

//     let sideLoadInst = getBot(byTag("name", "sideLoadInst"));
//     sideLoadInst.loadNoInput([instName, instName]); //[<name of inst to load>, <name of pattern to load the inst with (/ an egg to hatch)>]

//     tags.openedInst = instName;

// }