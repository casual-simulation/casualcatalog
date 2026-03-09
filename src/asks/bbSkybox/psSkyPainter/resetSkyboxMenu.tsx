const menuBots = getBots(b=>{
    if(b.tags.space == "tempLocal" && b.tags.bbSkyboxMenu == true){
        return true;
    }
})

whisper(menuBots, "loadMenuReset");