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

if (that.tags.includes("abCatalogSelected")) {
    if (tags.abCatalogSelected) {
        tags.currentFormAnimation = 'open';

        //lock catalog in place, disable dragging
        thisBot.lockStudio();

        //if default visuals
        if (!tags.hasCustomMesh && links.defaultVisualBot) {

            //change hitbox
            tags.scaleX = 1;
            tags.scaleY = 1.7;

            //activate opening animation
            if (!links.defaultVisualBot.tags.formAnimation.includes("opening") && !links.defaultVisualBot.tags.formAnimation.includes("idle_open")) {
                links.defaultVisualBot.tags.formAnimation = ["opening", "idle_open"];
            }

            //if pointer scale effect is active
            // if (masks.scaleX) {
            //     await os.sleep(0);
            //     thisBot.onPointerEnter();
            // }
        }

        //shoot out arm
        const dimension = configBot.tags.mapPortal ?? configBot.tags.gridPortal;
        const inMap = configBot.tags.mapPortal ? true : false;

        let posX = tags[dimension + 'X'] + (inMap ? .001 : 2);
        let posY = tags[dimension + 'Y'];

        const armBot = ab.links.arm_tool.abCreateArm({
            originBot: thisBot,
            dimension: dimension,
            position: {
                x: posX,
                y: posY
            },
        })

        thisBot.onArmPlaced({dimension: dimension, x: posX, y: posY})
    } else {
        tags.currentFormAnimation = 'closed';

        if (links.armBot) {
            destroy(links.armBot);
        }

        //allow easy movement for catalog
        thisBot.moveStudio();

        //if default visuals
        if (!tags.hasCustomMesh) {

            //fix hitbox
            tags.scaleX = 1;
            tags.scaleY = .7;

            //activate closing animation
            if (!links.defaultVisualBot.tags.formAnimation.includes("closing") && !links.defaultVisualBot.tags.formAnimation.includes("closed_static")) {
                links.defaultVisualBot.tags.formAnimation = ["closing", "closed_static"];
            }

            //handle on pointer enter scale effects
            // if (masks.scaleX) {
            //     await os.sleep(0);
            //     thisBot.onPointerEnter();
            // }

            // await os.sleep(600);
            // links.defaultVisualBot.tags.formAnimation = 'closed';
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