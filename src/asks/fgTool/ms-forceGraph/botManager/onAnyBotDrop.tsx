// resets the nodes for the sim to respond to the current bot positions on dragging bot drop
let graph = that.bot.tags.forceGraph;
if(graph && globalThis.simContainer){
    let nodes = nodeManager.getNodesFromBots();
    let simName = that.bot.tags.forceGraph;
    simContainer[simName] ? simContainer[simName].nodes(nodes[simName]) : null;
};