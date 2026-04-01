const attributeName = that.attributeName;
const newValue = that.value;

if (!attributeName) {
    console.log("[Scale Model Attributes]: editAttribute, no attribute name provided.");
    return;
}

if (!newValue && newValue != 0) {
    console.log("[Scale Model Attributes]: editAttribute, no new value provided.");
    return;
}

tags[attributeName] = newValue;

shout("clearScaleModelMenu");

if (links.statsButton) {
    thisBot.showStats();
}
