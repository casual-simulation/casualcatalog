if (!tags.enablePortalMove) {
    return;
} 

masks.home = false;
masks[configBot.tags.leftWristPortal] = true;
masks[configBot.tags.leftWristPortal + 'X'] = 0;
masks[configBot.tags.leftWristPortal + 'Y'] = 1;