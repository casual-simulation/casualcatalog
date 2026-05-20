// if (that.tags.includes("strokeColor")) {
//     if (links.strokeBot) {
//         links.strokeBot.tags.color = tags.strokeColor;
//     }
// }

if (that.tags.includes("selected")) {
    if (tags.selected) {
        shout("onStudioCatalogSelected", thisBot);
        thisBot.lockStudio();
        if (!tags.hasCustomMesh && links.visualBot && tags.currentFormAnimation != 'idle_open' && tags.currentFormAnimation != 'opening') {
            tags.currentFormAnimation = 'opening';
            tags.scaleX = 2;
            tags.scaleY = 3;
            links.visualBot.tags.scaleX = .5;
            links.visualBot.tags.scaleY = .33;
            links.visualBot.tags[tags.dimension + 'Y'] = null;
            links.visualBot.tags.formAnimation = "opening";
            os.startFormAnimation(links.visualBot, "opening", {clampWhenFinished: true});
            if (masks.scaleX) {
                await os.sleep(0);
                thisBot.onPointerEnter();
            }
        }
    } else {
        shout("onStudioCatalogDeselected", thisBot);
        thisBot.moveStudio();
        if (!tags.hasCustomMesh && tags.currentFormAnimation != 'closed' && tags.currentFormAnimation != 'closing') {
            tags.scaleX = 2;
            tags.scaleY = 2;
            links.visualBot.tags.scaleX = .5;
            links.visualBot.tags.scaleY = .5;
            links.visualBot.tags.formAnimation = null;
            links.visualBot.tags[tags.dimension + 'Y'] = -.3;
            tags.currentFormAnimation = 'closing';
            os.startFormAnimation(links.visualBot, "closing", {clampWhenFinished: true});
            if (masks.scaleX) {
                await os.sleep(0);
                thisBot.onPointerEnter();
            }
        }
    }
}