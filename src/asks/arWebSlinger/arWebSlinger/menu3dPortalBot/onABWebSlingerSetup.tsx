const { devMode } = that ?? {};

// Put the menu3d portal bot in the left wrist portal.
masks[configBot.masks.leftWristPortal] = true;
masks[configBot.masks.leftWristPortal + 'X'] = 0;
masks[configBot.masks.leftWristPortal + 'Y'] = 0;
masks[configBot.masks.leftWristPortal + 'Z'] = 0;