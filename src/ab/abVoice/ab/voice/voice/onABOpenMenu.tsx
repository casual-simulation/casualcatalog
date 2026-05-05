if (that.menu == 'core' || that.menu == 'grid') {
    //check if voice enabled
    if (tags.voiceEnabled ) {
        if (!thisBot.vars.humeSocket) {
            thisBot.startHume();
        }
        
        masks.muted = false;
    }
}