if (typeof thisBot.vars.onLoginUpdate === "function"){
    thisBot.vars.onLoginUpdate(masks.loggedin);
}

if (typeof thisBot.vars.onSaveUpdate === "function"){
    thisBot.vars.onSaveUpdate(masks.currentlySaving);
}

if (typeof thisBot.vars.onDebugUpdate === "function"){
    thisBot.vars.onDebugUpdate(tags.debugOn);
}
if(that.tags.includes("debugOn")){
    let debugMenu = getBot(byTag("name", "debugMenu"));
    if (tags.debugOn == false && debugMenu.masks.isOpen == true) debugMenu.closeApp();
}
console.log("hud")
shout("checkForNewDiscovery")