shout("onStudioCatalogDeselected", thisBot);
thisBot.moveStudio();
if (!tags.hasCustomMesh) {
    tags.scaleX = 2;
    tags.scaleY = 2;
    tags.scaleZ = 1.1;
    links.visualBot.tags.scaleX = .5;
    links.visualBot.tags.scaleY = .5;
    links.visualBot.tags.scaleY = .9;
    links.visualBot.tags.formAnimation = 'closed';
    links.visualBot.tags[tags.dimension + 'Y'] = -.3;
    tags.currentFormAnimation = 'closed';
}