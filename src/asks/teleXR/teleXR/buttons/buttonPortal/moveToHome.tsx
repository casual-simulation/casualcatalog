if (!tags.enablePortalMove) {
    return;
} 

masks.home = true;
masks[configBot.tags.leftWristPortal] = false;
masks[configBot.tags.leftWristPortal + 'X'] = null;
masks[configBot.tags.leftWristPortal + 'Y'] = null;

// CasualOS has some kind of bug with the portal form not reappearing after being added back to the home dimension here.
// Settings the form to none and then back to portal fixes it.
masks.form = 'none'
await os.sleep(0);
masks.form = 'portal';