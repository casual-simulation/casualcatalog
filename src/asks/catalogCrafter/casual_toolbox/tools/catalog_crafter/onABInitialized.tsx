if (!tags.defaultVisualBot && !tags.hasCustomMesh) {
    tags.defaultVisualBot = getLink(await thisBot.generateDefaultVisualBot());
}