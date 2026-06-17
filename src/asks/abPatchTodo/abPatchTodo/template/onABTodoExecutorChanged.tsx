// Shouted inst-wide when any user's executor changes. Only react for todos the local user owns.
if (tags.ownerId && tags.ownerId !== authBot?.id) {
    return;
}

if (tags.animationState === 'processing') {
    tags.animationState = 'incomplete';
}
