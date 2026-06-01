if (that == true) {
    tags.continueLocationPull = true;
    
    thisBot.updateLocation();
    shout("onAvatarGPSEnable", thisBot);
} else {
    tags.continueLocationPull = false;
    shout("onAvatarGPSDisable", thisBot);
}