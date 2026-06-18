if (that.portal == 'mapPortal' || that.portal == 'gridPortal') {
    // if (links.spriteBot) {
    //     links.spriteBot.tags[(tags.dimension ?? 'home') + 'Z'] = configBot.tags.mapPortal ? tags[(tags.dimension ?? 'home') + 'Z'] + tags.scaleZ + 35 : tags[(tags.dimension ?? 'home') + 'Z'] + tags.scaleZ - 1;
    //     links.spriteBot.tags[(tags.dimension ?? 'home') + 'X'] = tags[(tags.dimension ?? 'home') + 'X'];
    //     links.spriteBot.tags[(tags.dimension ?? 'home') + 'Y'] = tags[(tags.dimension ?? 'home') + 'Y'];
    // }
    if (configBot.tags.mapPortal) {
        tags.scale = 5;
    } else {
        tags.scale = 3;
    }
}