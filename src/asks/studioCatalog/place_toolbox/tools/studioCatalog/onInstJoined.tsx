shout("onStudioCatalogDeselected", thisBot);
thisBot.moveStudio();
if (!tags.hasCustomMesh) {
    tags.scaleX = 2;
    tags.scaleY = 2;
    tags.scaleZ = 1.1;
    links.defaultVisualBot.tags.scaleX = .5;
    links.defaultVisualBot.tags.scaleY = .5;
    links.defaultVisualBot.tags.scaleY = .9;
    links.defaultVisualBot.tags.formAnimation = 'closed';
    links.defaultVisualBot.tags[tags.dimension + 'Y'] = -.3;
    tags.currentFormAnimation = 'closed';
}