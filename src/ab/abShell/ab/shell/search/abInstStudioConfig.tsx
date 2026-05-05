if (ab.links.utils.isInstOwnedByStudio()) {
    return await thisBot.abStudioConfig({ studioId: configBot.tags.owner });
}

return null;
