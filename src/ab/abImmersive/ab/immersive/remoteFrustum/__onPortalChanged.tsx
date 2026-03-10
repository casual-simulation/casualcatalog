if (that.portal === 'gridPortal') {
    if (that.dimension === 'immerse') {
        // Remap home dimension to mainSceneDimension.
        // The home dimensions is only used to the mainSceneDimension to move
        // around in so we dont want to move our frustum there, we want to keep put it in mainSceneDimension.
        that.dimension = links.immersiveManager.tags.mainSceneDimension;
    }

    tags[tags.currentDimension] = null;
    tags.currentDimension = that.dimension;
    tags[that.dimension] = true;
}