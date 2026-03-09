let needCursorUpdate = that.tags.some((t) => t === 'mouseDown' || t === 'mouseOver');

if (needCursorUpdate) {
    thisBot.updatePortalCursor();
}