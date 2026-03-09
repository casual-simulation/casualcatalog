// gets the bots in the current gridPortal with forceGraph tags
let dim = configBot.tags.gridPortal;
let nodeBots = getBots(byTag('forceGraph'), byTag(dim, true));

// uses a reducer to get a nodes object that can be passed to force graph sims
let sortedNodes = nodeBots.reduce((acc, bot) => {
    let graph = bot.tags.forceGraph;
    let botX = dim + 'X';
    let botY = dim + 'Y';
    let botZ = dim + 'Z';
    let botVX
    let botVY
    let botVZ
    let botFX
    let botFY
    let botFZ

    acc[graph] ? null : acc[graph] = [];
    botX = bot.tags[botX] ? bot.tags[botX] : 0;
    botY = bot.tags[botY] ? bot.tags[botY] : 0;
    botZ = bot.tags[botZ] ? bot.tags[botZ] : 0;
    botVX = bot.tags['fgVX'] ? bot.tags['fgVX'] : 0;
    botVY = bot.tags['fgVY'] ? bot.tags['fgVY'] : 0;
    botVZ = bot.tags['fgVZ'] ? bot.tags['fgVZ'] : 0;
    botFX = bot.tags['fgFX'] || bot.tags['fgFX'] == 0 ? bot.tags['fgFX'] : null;
    botFY = bot.tags['fgFY'] || bot.tags['fgFY'] == 0 ? bot.tags['fgFY'] : null;
    botFZ = bot.tags['fgFZ'] || bot.tags['fgFZ'] == 0 ? bot.tags['fgFZ'] : null;

    let botNode = {
        'x': botX,
        'y': botY,
        'z': botZ,
        'botID': bot.id,
        'index': acc[graph].length,
        'vx': botVX,
        'vy': botVY,
        'vz': botVZ,
        'fx': botFX,
        'fy': botFY,
        'fz': botFZ
    }

    acc[graph].push(botNode);

    // if(bot.tags['fgGravity'] !== undefined){
    //     if(bot.tags['fgGravity'] == false){
    //         acc[graph][0].gravity = false
    //     }
    // }

    

    // // console.log('gravity', bot.tags['fgGravity'])

    // // bot.tags['fgGravity'] ? acc[graph][0].gravity = true : acc[graph][0].gravity = false

    // // Number(bot.tags['fgGravityX']) !== NaN ? acc[graph][0].gravityX = bot.tags['fgGravityX'] : acc[graph][0].gravityX = 0
    // // Number(bot.tags['fgGravityY']) !== NaN ? acc[graph][0].gravityY = bot.tags['fgGravityY'] : acc[graph][0].gravityY = 0
    // // Number(bot.tags['fgGravityZ']) !== NaN ? acc[graph][0].gravityZ = bot.tags['fgGravityZ'] : acc[graph][0].gravityZ = 0
    

    return acc;
}, {});

// console.log('sortedNodes', sortedNodes)


return sortedNodes;