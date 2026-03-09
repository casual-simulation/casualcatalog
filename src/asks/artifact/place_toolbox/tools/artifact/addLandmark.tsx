const landmarkBot = getBot("landmarkID", that);

if (!landmarkBot) {
    return;
}

if (!tags.landmarkIDs) {
    tags.landmarkIDs = [];
}

if (!tags.landmarkIDs.includes(that)) {
    tags.landmarkIDs.push(that);
}