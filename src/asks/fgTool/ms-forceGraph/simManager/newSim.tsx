// checks to make sure that the simContainer global variable exists, and creates it if it doesn't
globalThis.simContainer ? null : globalThis.simContainer = {};

// sets up variables for create a force graph sim using d3-force-3d
let {
    simName,
    nodes = [],
    dimensions = 3,
    gravity = true,
    gravityPos = { 'x': 0, 'y': 0, 'z': 0 },
    gravityRadius = 0,
    gravityStrength = 0.05,
    collision = true,
    collisionRadius = 1,
    charge = true,
    chargeStrength = -1,
    links = [],
    linkDistance = 5
} = that;

// simName = simName.trim()

if (tags.experimentalSettings == true) {
    getBots((bot) => {
        if (bot.tags.forceGraph == simName) {
            if (bot.tags.fgDimensions) {
                if (Number.isInteger(bot.tags.fgDimensions)) {
                    if (Number(bot.tags.fgDimensions) > 0 && Number(bot.tags.fgDimensions) < 4) {
                        dimensions = Number(bot.tags.fgDimensions)
                    }
                }
            }
            if (bot.tags.fgGravity == false) {
                gravity = false
            }
            if (Number(bot.tags.fgGravityX) || Number(bot.tags.fgGravityX) == 0) {
                gravityPos.x = Number(bot.tags.fgGravityX)
            }
            if (Number(bot.tags.fgGravityY) || Number(bot.tags.fgGravityY) == 0) {
                gravityPos.y = Number(bot.tags.fgGravityY)
            }
            if (Number(bot.tags.fgGravityZ) || Number(bot.tags.fgGravityZ) == 0) {
                gravityPos.z = Number(bot.tags.fgGravityZ)
            }
            if (typeof bot.tags.fgGravityPosition == 'object') {
                if (Array.isArray(bot.tags.fgGravityPosition)) {
                    Number(bot.tags.fgGravityPosition[0]) || Number(bot.tags.fgGravityPosition[0]) == 0 ? gravityPos.x = Number(bot.tags.fgGravityPosition[0]) : null
                    Number(bot.tags.fgGravityPosition[1]) || Number(bot.tags.fgGravityPosition[1]) == 0 ? gravityPos.y = Number(bot.tags.fgGravityPosition[1]) : null
                    Number(bot.tags.fgGravityPosition[2]) || Number(bot.tags.fgGravityPosition[2]) == 0 ? gravityPos.z = Number(bot.tags.fgGravityPosition[2]) : null
                }
                else {
                    Number(bot.tags.fgGravityPosition.x) || Number(bot.tags.fgGravityPosition.x) == 0 ? gravityPos.x = Number(bot.tags.fgGravityPosition.x) : null
                    Number(bot.tags.fgGravityPosition.y) || Number(bot.tags.fgGravityPosition.y) == 0 ? gravityPos.y = Number(bot.tags.fgGravityPosition.y) : null
                    Number(bot.tags.fgGravityPosition.z) || Number(bot.tags.fgGravityPosition.z) == 0 ? gravityPos.z = Number(bot.tags.fgGravityPosition.z) : null
                }
            }
            if (Number(bot.tags.fgGravityRadius) || Number(bot.tags.fgGravityRadius)) {
                gravityRadius = Number(bot.tags.fgGravityRadius)
            }
            if (Number(bot.tags.fgGravityStrength) || Number(bot.tags.fgGravityStrength) == 0) {
                gravityStrength = Number(bot.tags.fgGravityStrength)
            }
            if (bot.tags.fgCollision == false) {
                collision = false
            }
            if (Number(bot.tags.fgCollisionRadius) || Number(bot.tags.fgCollisionRadius) == 0) {
                collisionRadius = Number(bot.tags.fgCollisionRadius)
            }
            if (bot.tags.fgCharge == false) {
                charge = false
            }
            if (Number(bot.tags.fgChargeStrength) || Number(bot.tags.fgChargeStrength) == 0) {
                chargeStrength = Number(bot.tags.fgChargeStrength)
            }
        }
    })

    let settings = {
        dimensions,
        gravity,
        gravityPos,
        gravityRadius,
        gravityStrength,
        collision,
        collisionRadius,
        charge,
        chargeStrength
    };

    console.log(`${simName} settings`, settings)
}

// creates the sim in a paused state
let newSim = tags.autoStart == true ? d3.forceSimulation(nodes, dimensions) : d3.forceSimulation(nodes, dimensions).stop();

// creates a radial force that mimics gravity by giving the force a center of (0,0,0) and a radius of 0
if (gravity) {
    newSim.force('radialGravity', d3.forceRadial(gravityRadius, gravityPos.x, gravityPos.y, gravityPos.z).strength(gravityStrength));
    newSim.gravitySwitch = true
}
else {
    newSim.force('radialGravity', d3.forceRadial(gravityRadius, gravityPos.x, gravityPos.y, gravityPos.z).strength(0));
    newSim.gravitySwitch = false
}
newSim.gravityStrength = gravityStrength

// creates collision between nodes with the given radius
if (collision) {
    newSim.force('collision', d3.forceCollide(collisionRadius));
    newSim.collisionSwitch = true
}
else {
    newSim.force('collision', d3.forceCollide(0));
    newSim.collisionSwitch = false
}
newSim.collisionRadius = collisionRadius

// creates the repelling charge force that makes nodes push each other away
if (charge) {
    newSim.force('charge', d3.forceManyBody().strength(chargeStrength));
    newSim.chargeSwitch = true
}
else {
    newSim.force('charge', d3.forceManyBody().strength(0));
    newSim.chargeSwitch = false
}
newSim.chargeStrength = chargeStrength

// sets the newly created sim as a global variable
simContainer[simName] = newSim;

// console.log(`new sim ${simName} created`);
console.log('sim container: ', simContainer);

tags.autoStart == true ? simManager.start(simName) : null