const landmarkBot = getBot("landmarkID", that);

if (tags.collected) {
    return;
} else {
    const angle = Math.random() * Math.PI * 2;

    const offsetX = Math.cos(angle) * .0005;
    const offsetY = Math.sin(angle) * .0005;

    const randomX = landmarkBot.tags.homeX + offsetX;
    const randomY = landmarkBot.tags.homeY + offsetY;

    setTagMask(thisBot, "home", true, "tempLocal");
    setTagMask(thisBot, "homeX", randomX, "tempLocal");
    setTagMask(thisBot, "homeY", randomY, "tempLocal");
    setTagMask(thisBot, "collectable", true, "tempLocal");
    setTagMask(thisBot, "pointable", true, "tempLocal");
}   