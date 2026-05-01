const armBot = links.armBot;
const armDimension = armBot?.tags.dimension;

await thisBot.agentOnRequest({
    inquiry: that.text,
    menuType: that.menuType,
    armPosition: armBot ? {
        dimension: armDimension,
        x: armBot.tags[armDimension + 'X'],
        y: armBot.tags[armDimension + 'Y'],
    } : undefined,
});