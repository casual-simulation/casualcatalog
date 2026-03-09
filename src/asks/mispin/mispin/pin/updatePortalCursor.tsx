let cursor = null;

if (tags.mouseDown) {
    cursor = 'grabbing';    
} else if (tags.mouseOver) {
    cursor = 'grab';
}


if (gridPortalBot) {
    gridPortalBot.masks.portalCursor = cursor;
}