const { botIDs } = that;

if (tags.lineTo && botIDs.includes(tags.lineTo) && tags.originType == 'eggConfigurator') {
    // If the catalog bot that this kit was pointed at is removed, then we should remove this kit as well.
    destroy(thisBot);
}