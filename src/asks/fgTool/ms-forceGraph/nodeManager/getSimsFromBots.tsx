// gets the bots in the current gridPortal with forceGraph tags
let dim = configBot.tags.gridPortal;
let nodeBots = getBots(byTag('forceGraph'), byTag(dim, true));

// uses a reducer to get a nodes object that can be passed to force graph sims
let simArray = nodeBots.reduce((acc, bot) => {
    let graph = bot.tags.forceGraph;
    acc.includes(graph) ? null : acc.push(graph)
    return acc;
}, []);

// console.log('sims', simArray);

return simArray;