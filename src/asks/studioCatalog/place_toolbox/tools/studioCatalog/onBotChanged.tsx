// if (that.tags.includes("strokeColor")) {
//     if (links.strokeBot) {
//         links.strokeBot.tags.color = tags.strokeColor;
//     }
// }

if (that.tags.includes("selected")) {
    if (tags.selected) {
        shout("onStudioCatalogSelected", thisBot);
        thisBot.lockStudio();
        if (!tags.hasCustomMesh && links.defaultVisualBot && tags.currentFormAnimation != 'idle_open' && tags.currentFormAnimation != 'opening') {
            tags.currentFormAnimation = 'opening';
            tags.scaleX = 2;
            tags.scaleY = 3;
            links.defaultVisualBot.tags.scaleX = .5;
            links.defaultVisualBot.tags.scaleY = .33;
            links.defaultVisualBot.tags[tags.dimension + 'Y'] = null;
            links.defaultVisualBot.tags.formAnimation = "opening";
            os.startFormAnimation(links.defaultVisualBot, "opening", {clampWhenFinished: true});
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
            links.defaultVisualBot.tags.scaleX = .5;
            links.defaultVisualBot.tags.scaleY = .5;
            links.defaultVisualBot.tags.formAnimation = null;
            links.defaultVisualBot.tags[tags.dimension + 'Y'] = -.3;
            tags.currentFormAnimation = 'closing';
            os.startFormAnimation(links.defaultVisualBot, "closing", {clampWhenFinished: true});
            if (masks.scaleX) {
                await os.sleep(0);
                thisBot.onPointerEnter();
            }
        }
    }
}