const data = that.data;
tags.homeLoaded = data.homeLoaded ?? false;

if (!tags.homeLoaded) {
    thisBot.onEggHatch();
}