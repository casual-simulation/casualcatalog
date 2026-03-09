// console.log('updater running')

// checks if any bots have a sim's name as its forceGraph tag, and if not, delete the sim
// if a sim is found that is missing from the simContainer, it gets instantiated
if(globalThis.simContainer){
    let sims = await nodeManager.getSimsFromBots();

    for(let sim in simContainer){
        sims.includes(sim) ? null : delete simContainer[sim];
    };

    // console.log("sims", sims)

    for(let sim of sims){
        // console.log("sim", sim)
        simContainer[sim] ? null : simManager.newSim({ simName: sim });
    }

    // console.log('simContainer',simContainer)
}
else {
    globalThis.simContainer = {};
}

// pauses for a second in order to help performance
await os.sleep(1000);

// shouts itself to restart this tag
self.requestAnimationFrame(() => {
    whisper(thisBot, 'update');
});