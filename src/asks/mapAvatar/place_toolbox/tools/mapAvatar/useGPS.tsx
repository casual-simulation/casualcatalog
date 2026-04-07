if (that) {
    tags.draggable = false;
    tags.usingGPS = true;
    clearAnimations(thisBot);
    setTagMask(thisBot, that.dimension + 'X', that.position.x, "shared");
    setTagMask(thisBot, that.dimension + 'Y', that.position.y, "shared");
} else {
    tags.draggable = true;
    tags.usingGPS = false;
}