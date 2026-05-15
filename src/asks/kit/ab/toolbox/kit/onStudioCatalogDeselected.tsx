if (that.tags.studioId != tags.studioId || tags.lineTo != getID(that)) {
    return;
}

const dimension = configBot.tags.mapPortal ?? configBot.tags.gridPortal ?? tags.dimension ?? 'home';

tags[dimension] = false;
masks[dimension] = null;