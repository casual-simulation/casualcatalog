// thisBot.onAnyBotsChanged([
//     {
//         tags: [
//             'forceGraph',
//             'fgGravity',
//             'fgGravityPosition',
//             'fgGravityStrength',
//             'fgGravityRadius',
//             'fgDimensions',
//             'fgCollision',
//             'fgCollisionRadius',
//             'fgCharge',
//             'fgChargeStrength'
//         ]
//     }
// ]);
if (globalThis.nodeManager) {
    let sims = nodeManager.getSimsFromBots();
    for (let sim in sims) {
        simManager.newSim({
            simName: sims[sim]
        });
    };
};