shout("clearActionMenu");

//await os.sleep(0);

if (configBot.tags.menuPortal != "action_menu") {
    configBot.tags.menuPortal = "action_menu";
}

const simXPBot = getBot(byTag("xp", true), byTag("xpType", "sim"), byTag("simUser", authBot.id));

const stats = await simXPBot.getStats();
if (stats) {
    ab.links.menu.abCreateMenuDropdown(stats);
}

for (let i = 0; i < simXPBot.tags.queuedActions.length; ++i) {
    const actionBot = getBot("simID", simXPBot.tags.queuedActions[i].id);
    if (!actionBot || actionBot.tags.hideAction == true) {
        continue;
    }

    if (actionBot.tags.actionTriggerFilter && actionBot.tags.actionTriggerFilter.length > 0) {
        let filterSatisfied = true;
        for (let i = 0; i < actionBot.tags.actionTriggerFilter.length; ++i) {
            const completed = await thisBot.getActionCompletionState(actionBot.tags.actionTriggerFilter[i]);
            if (completed == false) {
                filterSatisfied = false;
            }
        }
        if (filterSatisfied == true) {
            actionBot.showAction();
            continue; 
        }
    } else {
      actionBot.showAction();  
    }
}
