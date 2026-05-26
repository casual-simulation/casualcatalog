masks.scaleX = null;
masks.scaleY = null;
masks.scaleZ = null;
masks.scaleX = (tags.scaleX ?? 1) + .2;
masks.scaleY = (tags.scaleY ?? 1) + .2;
masks.scaleZ = (tags.scaleZ ?? 1) + .2;

if (links.defaultVisualBot) {
    links.defaultVisualBot.masks.scaleX = null;
    links.defaultVisualBot.masks.scaleY = null;
    links.defaultVisualBot.masks.scaleZ = null;
    links.defaultVisualBot.masks.scaleX = 1.2;
    links.defaultVisualBot.masks.scaleY = 1.2;
    links.defaultVisualBot.masks.scaleZ = 1.2;
}