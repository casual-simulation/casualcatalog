shout("onStudioCatalogDeselected", thisBot);
thisBot.moveStudio();
if (!tags.hasCustomMesh) {
    tags.scaleX = 2;
    tags.scaleY = 2;
    tags.scaleZ = 1.1;
    links.defaultVisualBot.tags.formAnimation = 'closed';
    tags.currentFormAnimation = 'closed';
}