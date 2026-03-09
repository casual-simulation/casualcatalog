const { dimension, position, initial } = that;

if (initial && configBot.tags.gridPortal === dimension) {
    os.focusOn(position, { zoom: tags.defaultGridPortalZoom, portal: 'gridPortal' });
}