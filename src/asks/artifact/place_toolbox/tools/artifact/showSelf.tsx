const landmarkBot = getBot("landmarkID", that);

if (tags.collected) {
    return;
} else {
    setTagMask(thisBot, "home", true, "tempLocal");
    setTagMask(thisBot, "homeX", landmarkBot.tags.homeX + .0005, "tempLocal");
    setTagMask(thisBot, "homeY", landmarkBot.tags.homeY + .0005, "tempLocal");
    setTagMask(thisBot, "collectable", true, "tempLocal");
    setTagMask(thisBot, "pointable", true, "tempLocal");
}