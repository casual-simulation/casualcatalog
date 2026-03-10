// console.log('custom dragging');

// grabs the sim name from the bot and continually sets the sim's alpha value to 1, the same as when a sim is first started
let simName = that.bot.tags.forceGraph;
simContainer[simName].alpha(1);

// grabs the nodes from the sim and fixes the node representing the currently dragged bot to the current dragging position
let nodes = simContainer[simName].nodes();
for(let node in nodes){
    if(nodes[node].botID == that.bot.id){
        nodes[node].fx = that.to.x;
        nodes[node].fy = that.to.y;
        nodes[node].fz = 0;
    };
};

// sets the alterned nodes back to the sim
simContainer[simName].nodes(nodes);