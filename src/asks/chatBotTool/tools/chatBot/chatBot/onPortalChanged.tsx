if (that.portal == "menuPortal" && that.dimension != "chatBarMenu") {
    if (thisBot.vars.menuBot) {
        destroy(thisBot.vars.menuBot);
        thisBot.vars.menuBot = null;
    }
    
    masks[os.getCurrentDimension()] = true;
}