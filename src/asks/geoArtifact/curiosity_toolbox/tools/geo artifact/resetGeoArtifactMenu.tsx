const menuBots = getBots(b=>{
    if(b.tags.space == "tempLocal" && b.tags.geoArtifactTool == true){
        return true;
    }
})

whisper(menuBots, "geoArtifactMenuReset");
setTagMask(thisBot, "menuOpen", false, "tempLocal");