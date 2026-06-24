shout("clearActionMenu");

//await os.sleep(0);

if (configBot.tags.menuPortal != "action_menu") {
    configBot.tags.menuPortal = "action_menu";
}


for (let i = 0; i < tags.queuedActions.length; ++i) {
    const actionBot = getBot("simID", tags.queuedActions[i].id);
    if (!actionBot || actionBot.tags.hideAction == true) {
        continue;
    }
    
    actionBot.showAction();  
}
