if (!that) {
    return;
}

tags.longitude = tags[that + "X"];
tags.latitude = tags[that + "Y"];

thisBot.createGeoArtifactMenu();