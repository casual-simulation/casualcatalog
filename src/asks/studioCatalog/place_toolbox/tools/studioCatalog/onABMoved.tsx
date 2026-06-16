const dimension = configBot.tags.mapPortal ?? configBot.tags.gridPortal ?? tags.dimension ?? 'home';
links.defaultVisualBot.tags[dimension] = false;
links.defaultVisualBot.masks[dimension] = null;

tags.abEquipmentFor = ab.links.manifestation.links.abBot.id;