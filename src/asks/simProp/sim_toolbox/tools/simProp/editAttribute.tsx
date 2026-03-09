const attributeName = that.attributeName;
const newValue = that.value;

const tempAttributes = {...tags.simAttributes};

if (!attributeName) {
    console.log("[Sim Attributes]: editAttribute, no attribute name provided.");
    return;
}

if (!newValue && newValue != 0) {
    console.log("[Sim Attributes]: editAttribute, no new value provided.");
    return;
}

tempAttributes[attributeName] = newValue;
tags.simAttributes = tempAttributes;

// tags.simAttributes[attributeName] = newValue;

thisBot.setProgressBar();

shout("clearSimPropMenu");
shout("clearPropStatsMenu");

if (links.statsButton) {
    thisBot.showStats();
}
