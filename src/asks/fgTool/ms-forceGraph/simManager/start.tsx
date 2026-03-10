// starts a simulation, usually whenever a node is being dragged, using the provided sim name when called

let simName = that;

console.log(`starting force graph '${simName}'`);

// sets the sim's alpha (analogous to a countdown timer) to the maximum value of one before having the sim resume if stopped
simContainer[simName].alpha(1);
simContainer[simName].restart();

// gets the nodes and links needed for the sim
let nodes = await nodeManager.getNodesFromBots();
let botLinks = await nodeManager.getLinksFromBots();

// console.log('nodes',nodes)
// for(let sim in botLinks){
//     console.log(`${sim} sim links`, botLinks[sim].links())
// }
// console.log('nodes[simName]',nodes[simName])
// botLinks[simName] ? console.log('botLinks[simName].links()', botLinks[simName].links()) : null

// assignes the nodes and the links to the sim using the built in methods
simContainer[simName].nodes(nodes[simName]);
botLinks[simName] ? simContainer[simName].force('links', botLinks[simName]) : null;

// sets the sim to run the visualUpdater whenever the simulation ticks
simContainer[simName].on('tick', () => {
    // console.log(`${simName} simulation tick`);
    simManager.visualUpdater(simName);
    // console.log(simContainer[simName].nodes());
});

// sets the simulation to console out whenever the force graph simulation finishes running
simContainer[simName].on('end', () => {
    console.log(`force graph '${simName}' end`);
});