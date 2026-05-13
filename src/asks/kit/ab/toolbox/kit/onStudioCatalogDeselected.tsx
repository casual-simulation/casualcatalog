const dimension = configBot.tags.mapPortal ?? configBot.tags.gridPortal ?? tags.dimension ?? 'home';

tags[dimension] = false;
masks[dimension] = null;