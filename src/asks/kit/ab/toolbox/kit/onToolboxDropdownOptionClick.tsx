const { toolbox, tool } = that;

if (toolbox === thisBot) {
    if (links.armBot) {
        destroy(links.armBot);
    }
}