configBot.masks.menuPortal = null;
thisBot._menu_setRBMenuState("mainMenu");

if(tags.hideMemory == false && !configBot.tags.mapPortal){
    // thisBot._brain_toggleNeurons("show");
    thisBot._brain_createFGBNeurons();
}