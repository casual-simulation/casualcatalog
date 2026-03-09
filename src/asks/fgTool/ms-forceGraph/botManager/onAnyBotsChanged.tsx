// checks for changed forceGraph tags and makes sure that sims exist for those tags
// console.log(that)
if (globalThis.nodeManager) {
    for (let changes of that) {
        // creates any sims needed whenever a forceGraph tag is edited on a bot
        if (changes.tags.includes('forceGraph')) {
            // console.log('forceGraph tag changed')
            let sims = nodeManager.getSimsFromBots();
            for (let sim in sims) {
                simManager.newSim({
                    simName: sims[sim]
                });
            };
        };
        // if (changes.tags.includes('fgGravity')) {};
        // if (changes.tags.includes('fgGravityPosition') 
        // || changes.tags.includes('fgGravityX') 
        // || changes.tags.includes('fgGravityY') 
        // || changes.tags.includes('fgGravityZ')) {};
        if (changes.tags.includes('fgGravity')) {
            simManager.updateSim({
                simName: changes.bot.tags.forceGraph,
                setting: 'gravity',
                value: changes.bot.tags.fgGravity
            })
        };
        if (changes.tags.includes('fgGravityPosition')) {
            simManager.updateSim({
                simName: changes.bot.tags.forceGraph,
                setting: 'gravityPosition',
                value: changes.bot.tags.fgGravityPosition
            })
        };
        if (changes.tags.includes('fgGravityX')) { 
            simManager.updateSim({
                simName: changes.bot.tags.forceGraph,
                setting: 'gravityX',
                value: changes.bot.tags.fgGravityX
            })
        };
        if (changes.tags.includes('fgGravityY')) { 
            simManager.updateSim({
                simName: changes.bot.tags.forceGraph,
                setting: 'gravityY',
                value: changes.bot.tags.fgGravityY
            })
        };
        if (changes.tags.includes('fgGravityZ')) { 
            simManager.updateSim({
                simName: changes.bot.tags.forceGraph,
                setting: 'gravityZ',
                value: changes.bot.tags.fgGravityZ
            })
        };
        if (changes.tags.includes('fgGravityStrength')) { 
            simManager.updateSim({
                simName: changes.bot.tags.forceGraph,
                setting: 'gravityStrength',
                value: changes.bot.tags.fgGravityStrength
            })
        };
        if (changes.tags.includes('fgGravityRadius')) { 
            simManager.updateSim({
                simName: changes.bot.tags.forceGraph,
                setting: 'gravityRadius',
                value: changes.bot.tags.fgGravityRadius
            })
        };
        if (changes.tags.includes('fgDimensions')) { 
            simManager.updateSim({
                simName: changes.bot.tags.forceGraph,
                setting: 'dimensions',
                value: changes.bot.tags.fgDimensions
            })
        };
        if (changes.tags.includes('fgCollision')) { 
            simManager.updateSim({
                simName: changes.bot.tags.forceGraph,
                setting: 'collision',
                value: changes.bot.tags.fgCollision
            })
        };
        if (changes.tags.includes('fgCollisionRadius')) { 
            simManager.updateSim({
                simName: changes.bot.tags.forceGraph,
                setting: 'collisionRadius',
                value: changes.bot.tags.fgCollisionRadius
            })
        };
        if (changes.tags.includes('fgCharge')) { 
            simManager.updateSim({
                simName: changes.bot.tags.forceGraph,
                setting: 'charge',
                value: changes.bot.tags.fgCharge
            })
        };
        if (changes.tags.includes('fgChargeStrength')) { 
            simManager.updateSim({
                simName: changes.bot.tags.forceGraph,
                setting: 'chargeStrength',
                value: changes.bot.tags.fgChargeStrength
            })
        };
        if (changes.tags.includes('fgSettings')) { 
            simManager.updateSim({
                simName: changes.bot.tags.forceGraph,
                setting: 'settingsObject',
                value: changes.bot.tags.fgSettings
            })
        };
    };
};