// console.log('drag started');
// console.log('dragged bot',that.bot);
// console.log('bot sim: ' + that.bot.tags.forceGraph);

// checks to see if a bot with a populated forceGraph tag is being dragged, and if so, start whatever simulation that bot is set to in that tag while enabling custom dragging
if (that.bot.tags.forceGraph) {
    os.enableCustomDragging();
    if (globalThis.simContainer) {
        if (simContainer[that.bot.tags.forceGraph]) {
            simManager.start(that.bot.tags.forceGraph);
        }
        // else {
        //     simManager.newSim({
        //         simName: that.bot.tags.forceGraph
        //     });
        // }
    };
};