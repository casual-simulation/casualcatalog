if (that.tags.studioId != tags.studioId || tags.lineTo != getID(that)) {
    return;
}

const dimension = configBot.tags.mapPortal ?? configBot.tags.gridPortal ?? tags.dimension ?? 'home';

masks[dimension] = true;
masks.pointable = null;
masks.formOpacity = 0;

os.sleep(100).then(() => {
    // Fixes a a timing issue where the form is briefly visible playing the incorrect animation when the studio catalog is selected.
    masks.formOpacity = null;
    masks.animationState = 'appear';
});
