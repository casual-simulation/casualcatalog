const dimension = configBot.tags.mapPortal ?? configBot.tags.gridPortal ?? tags.dimension ?? 'home';
masks[dimension] = true;
links.defaultVisualBot.masks[dimension] = true;