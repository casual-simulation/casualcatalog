// if (that.tags.includes("strokeColor")) {
//     if (links.strokeBot) {
//         links.strokeBot.tags.color = tags.strokeColor;
//     }
// }

if (that.tags.includes("selected")) {
    if (tags.selected) {
        shout("onStudioCatalogSelected", thisBot);
        thisBot.lockStudio();
        if (!tags.hasCustomMesh) {
            tags.currentFormAnimation = 'opening';
            os.startFormAnimation(thisBot, "opening");
        }
    } else {
        shout("onStudioCatalogDeselected", thisBot);
        thisBot.moveStudio();
        if (!tags.hasCustomMesh) {
            tags.currentFormAnimation = 'closing';
            os.startFormAnimation(thisBot, "closing");
        }
    }
}