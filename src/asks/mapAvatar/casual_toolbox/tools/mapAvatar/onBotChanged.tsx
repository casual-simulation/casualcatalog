if (that.tags.includes((tags.dimension ?? 'home') + 'X') || that.tags.includes((tags.dimension ?? 'home') + 'Y')) {
    if (links.spriteBot) {
        links.spriteBot.tags[(tags.dimension ?? 'home') + 'Z'] = configBot.tags.mapPortal ? (tags[(tags.dimension ?? 'home') + 'Z'] ?? 0) + tags.scaleZ + 35 : (tags[(tags.dimension ?? 'home') + 'Z'] ?? 0) + tags.scaleZ - 1.5;
        links.spriteBot.tags[(tags.dimension ?? 'home') + 'X'] = tags[(tags.dimension ?? 'home') + 'X'];
        links.spriteBot.tags[(tags.dimension ?? 'home') + 'Y'] = tags[(tags.dimension ?? 'home') + 'Y'];
    }
}