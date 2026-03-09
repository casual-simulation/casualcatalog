// gets any bots in the current gridPortal with both a forceGraph and a lineTo tag
let linkedBots = getBots(byTag('forceGraph'), byTag(configBot.tags.gridPortal), byTag('lineTo'));

// uses a reducer to create an object of links based on the lineTo tag of each bot
// checks to make sure whether a bot's lineTo is an object or string, and checks to make sure that both bots involved are in the same force graph sim
let linkDistance = 5;
let sortedLinks = linkedBots.reduce((acc, bot) => {
    let graph = bot.tags.forceGraph;
    let lines = bot.tags.lineTo;
    
    if(bot.tags.fgSettings){
        if(Number(bot.tags.fgSettings.linkDistance) != NaN){
            linkDistance = Number(bot.tags.fgSettings.linkDistance)
        }
    }

    if(bot.tags['fgLineDistance']){
        if(Number(bot.tags['fgLineDistance']) != NaN){
            linkDistance = Number(bot.tags['fgLineDistance'])
        }
    }

    if(typeof lines == 'object'){
        for(let line of lines){
            let target = getBot(byID(line))
            if(target){
                if(target.tags.forceGraph == graph){
                    acc[graph] ? null : acc[graph] = [];
                    acc[graph].push({
                        'source': bot.id,
                        'target': line,
                        'index': acc[graph].length
                    });
                }
            }
        }
    }
    else{
        let target = getBot(byID(lines));
        if(target){
            if(target.tags.forceGraph == graph){
                acc[graph] ? null : acc[graph] = [];
                acc[graph].push({
                    'source': bot.id,
                    'target': lines,
                    'index': acc[graph].length
                });
            }
        }
    }

    return acc;
}, {})

// the custom function used to have links reference botID properties on nodes rather than indexes
function id(d) {return d.botID;};

// creates a set of link force functions using d3-force-3d for each force graph sim
for(let sim in sortedLinks){
    let tempLink = d3.forceLink();
    tempLink.id(id);
    tempLink.distance(linkDistance);
    tempLink.links(sortedLinks[sim]);
    sortedLinks[sim] = tempLink;
};

return sortedLinks;