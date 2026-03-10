const dimension = ab.links.remember.tags.abActiveDimension;

if (!dimension) {
    return;
}

if (that.tags.includes(dimension + "X") || that.tags.includes(dimension + "Y")) {
    tags.longitude = tags[dimension + "X"];
    tags.latitude = tags[dimension + "Y"];
}