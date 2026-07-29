if (that) {
    setTagMask(thisBot, "usingGPS", true, "shared");
    shout("onGPSEnabled");
} else {
    setTagMask(thisBot, "usingGPS", null, "shared");
    shout("onGPSDisabled");
}