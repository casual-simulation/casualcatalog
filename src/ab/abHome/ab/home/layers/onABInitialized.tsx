thisBot.abShowMenuOnBeforeCreate();

superShout("onLayerActivated", os.getCurrentInst());

if (Array.isArray(configBot.tags.tempInst)) {
    let studioData = await os.listUserStudios();

    if (studioData.success) {
        const studios = studioData.studios;

        for (const tempInst of configBot.tags.tempInst) {
            if (tempInst !== 'home') {
                const idString = tempInst.slice(0, 4);
                const matchingStudio = studios.find(studio => studio.studioId.startsWith(idString));
                
                if (matchingStudio) {
                    thisBot.toggleLayer({ studioId: matchingStudio.studioId, keepLoaded: true });
                } else {
                    console.warn(`Could not find studio starting with ${idString} for tempInst ${tempInst}`);
                }
            }
        }
    } else {
        console.warn("Failed to list user studios:", studioData.errorMessage);
    }
}