if (that.portal == 'gridPortal') {
    if (that.dimension == tags.chosenDimension) {
        thisBot.enterWorldView();
    } else if (that.dimension == 'home' || that.dimension == 'blueprint') {
        thisBot.exitWorldView();
    }
}