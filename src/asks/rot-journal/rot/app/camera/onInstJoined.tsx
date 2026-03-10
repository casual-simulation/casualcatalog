const currentInsts = Array.isArray(configBot.tags.inst) ? configBot.tags.inst : [configBot.tags.inst]; //Check if you have an inst sideloaded

if (currentInsts.length == 1){
    tags.currMenu = ""
    thisBot.openApp()
}