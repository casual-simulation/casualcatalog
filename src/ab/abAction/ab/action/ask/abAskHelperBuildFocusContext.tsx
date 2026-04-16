const { menuType, menuActionData, abDimension } = that.askContext;

if (menuType === 'bot' && menuActionData?.bot) {
    return { type: 'bot', id: menuActionData.bot, dimension: abDimension };
} else if (menuType === 'grid' && menuActionData?.dimension) {
    return { type: 'grid', dimension: menuActionData.dimension, x: menuActionData.dimensionX ?? 0, y: menuActionData.dimensionY ?? 0 };
} else if (menuType === 'multipleBot' && menuActionData?.bots?.length) {
    return { type: 'multipleBot', ids: menuActionData.bots.filter(Boolean), dimension: abDimension };
} else {
    return { type: 'dimension', dimension: abDimension };
}
