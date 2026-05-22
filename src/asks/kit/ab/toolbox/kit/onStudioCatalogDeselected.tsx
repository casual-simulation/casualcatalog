if (that.tags.studioId != tags.studioId || tags.lineTo != getID(that)) {
    return;
}

masks.pointable = false;
tags.animationState = 'disappear';
