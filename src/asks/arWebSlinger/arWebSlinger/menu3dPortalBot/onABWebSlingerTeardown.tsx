const { devMode } = that ?? {};

// Remove the menu3d portal bot from the left wrist portal.
masks[configBot.masks.leftWristPortal] = null;
masks[configBot.masks.leftWristPortal + 'X'] = null;
masks[configBot.masks.leftWristPortal + 'Y'] = null;
masks[configBot.masks.leftWristPortal + 'Z'] = null;