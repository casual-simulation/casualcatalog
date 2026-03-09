// grabs the nodes from the running simulation and sets the positions of the conjoining bots in the gridPortal to match the simulated positions
let nodes = simContainer[that] ? simContainer[that].nodes() : [];
// console.log(nodes);


let notFound = [];
for (let i = 0; i < nodes.length; i++) {
    let dim = configBot.tags.gridPortal;
    let bot = getBot(byID(nodes[i].botID));
    let dimNum = simContainer[that].numDimensions()
    if (bot) {
        setTag(bot, dim + 'X', nodes[i].x);
        dimNum > 1 ? setTag(bot, dim + 'Y', nodes[i].y) : setTag(bot, dim + 'Y', simContainer[that].force('radialGravity').y());
        dimNum > 2 ? setTag(bot, dim + 'Z', nodes[i].z) : setTag(bot, dim + 'Z', simContainer[that].force('radialGravity').z());
    }
    else {
        notFound.push(i);
    }
};

// removes nodes from the sim if the bot can't be found
if(notFound.length > 0){
    notFound.sort((a, b)=>{
        return b - a
    });

    for(let i = 0; i < notFound.length; i++){
        nodes = nodes.splice(notFound[i], 1)
    };

    for(let i = 0; i < nodes.length; i++){
        nodes[i].index = i
    }
}