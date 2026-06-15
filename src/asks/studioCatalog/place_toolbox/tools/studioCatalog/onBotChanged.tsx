if (that.tags.includes("color") && tags.color != 'clear') {
    if (links.defaultVisualBot) {
        links.defaultVisualBot.tags.color = tags.color;
    }

    if (!tags.hasCustomMesh) {
        tags.labelFloatingBackgroundColor = tags.color;
        tags.color = 'clear';
    }
}

const dimension = configBot.tags.mapPortal ?? configBot.tags.gridPortal ?? tags.dimension ?? 'home';
if (that.tags.includes(dimension + 'X') || that.tags.includes(dimension + 'Y')) {
    if (links.defaultVisualBot) {
        links.defaultVisualBot.tags[dimension + 'X'] = tags[dimension + 'X'];
        links.defaultVisualBot.tags[dimension + 'Y'] = tags[dimension + 'Y'];
    }
}

if (that.tags.includes("abEquipmentBaseSelected")) {
    if (tags.abEquipmentBaseSelected) {
        shout("onStudioCatalogSelected", thisBot);
        thisBot.lockStudio();
        if (!tags.hasCustomMesh && links.defaultVisualBot && tags.currentFormAnimation != 'open') {
            tags.currentFormAnimation = 'open';
            tags.scaleX = 1.5;
            tags.scaleY = 2;
            links.defaultVisualBot.tags.formAnimation = null;
            links.defaultVisualBot.tags.formAnimation = ["opening", "idle_open"];
            if (masks.scaleX) {
                await os.sleep(0);
                thisBot.onPointerEnter();
            }
        }
    } else {
        shout("onStudioCatalogDeselected", thisBot);
        thisBot.moveStudio();
        if (!tags.hasCustomMesh && tags.currentFormAnimation != 'closed') {
            tags.currentFormAnimation = 'closed';
            tags.scaleX = 1.5;
            tags.scaleY = 1;
            links.defaultVisualBot.tags.formAnimation = null;
            links.defaultVisualBot.tags.formAnimation = ["closing", "closed"];
            if (masks.scaleX) {
                await os.sleep(0);
                thisBot.onPointerEnter();
            }
        }
    }
}

if (that.tags.includes("currentFormAnimation")) {
    if (tags.currentFormAnimation == 'closed') {
        tags.soundDrop = '/asks/audio-assets/popup_appear.wav'
    } else {
        tags.soundDrop = '/asks/audio-assets/drop_block_in_place_03.mp3'
    }
}