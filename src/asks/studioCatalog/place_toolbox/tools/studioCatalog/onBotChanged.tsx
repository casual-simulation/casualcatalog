if (that.tags.includes("color") && tags.color != 'clear') {
    if (links.defaultVisualBot) {
        links.defaultVisualBot.tags.color = tags.color;
    }
    tags.color = 'clear';
}

if (that.tags.includes("selected")) {
    if (tags.selected) {
        shout("onStudioCatalogSelected", thisBot);
        thisBot.lockStudio();
        if (!tags.hasCustomMesh && links.defaultVisualBot && tags.currentFormAnimation != 'idle_open' && tags.currentFormAnimation != 'opening') {
            tags.currentFormAnimation = 'opening';
            tags.scaleX = 2;
            tags.scaleY = 3;
            links.defaultVisualBot.tags.formAnimation = null;
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
            links.defaultVisualBot.tags.formAnimation = null;
            tags.currentFormAnimation = 'closing';
            os.startFormAnimation(links.defaultVisualBot, "closing", {clampWhenFinished: true});
            if (masks.scaleX) {
                await os.sleep(0);
                thisBot.onPointerEnter();
            }
        }
    }
}