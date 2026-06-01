if (that) {
    tags.draggable = false;
    tags.usingGPS = true;
} else {
    clearAnimations(thisBot);
    tags.draggable = true;
    tags.usingGPS = false;
}