if (that.tags.studioId != tags.studioId || tags.lineTo != getID(that)) {
    return;
}

masks.pointable = false;

if (tags.hasCustomMesh) {
    // Custom meshes may not have the 'exit' animation, so just hide immediately
    // since onFormAnimationFinished won't fire to remove us from the dimension.
    const dimension = configBot.tags.mapPortal ?? configBot.tags.gridPortal ?? tags.dimension ?? 'home';
    tags[dimension] = false;
    masks[dimension] = null;
    masks.pointable = null;
} else {
    masks.animationState = 'disappear';
}
