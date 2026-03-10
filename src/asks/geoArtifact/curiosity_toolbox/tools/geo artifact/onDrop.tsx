const dimension = ab.links.remember.tags.abActiveDimension;

if (!dimension) {
    return;
}

tags.longitude = tags[dimension + "X"];
tags.latitude = tags[dimension + "Y"];

if (tags.menuOpen && configBot.tags.menuPortal == "geoArtifactConfigMenu") {
    thisBot.createGeoArtifactMenu();
}
