// updates sims whenever new bots are added to the sim
let bots = that.bots;

for (let i = 0; i < bots.length; i++) {
    if (bots[i].tags.forceGraph) {
        if (simContainer[bots[i].tags.forceGraph]) {
            let tags = Object.keys(bots[i].tags)
            let update = false
            let settings = [
                'fgDimensions',
                'fgGravity',
                'fgGravityPosition',
                'fgGravityRadius',
                'fgGravityStrength',
                'fgCollision',
                'fgCollisionRadius',
                'fgCharge',
                'fgChargeStrength',
                'fgSettings'
            ]
            for(let j = 0; j < settings.length; j++){
                tags.includes(settings[j]) ? update = true : null
                if(update == true){
                    break
                }
            }
            update == true ? thisBot.forceUpdate() : null
        }
        else {
            thisBot.forceUpdate();
        }
    };
};