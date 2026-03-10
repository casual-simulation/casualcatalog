for (let j = 0; j < that.length; ++j) {
    if (!that[j]) {
        continue;
    }
    
    if (that[j].bot && that[j].bot.tags.nearbyNotify == true) {
        const inMap = configBot.tags.mapPortal ? true : false;
        const currDimension = configBot.tags.mapPortal ?? configBot.tags.gridPortal;
        if (that[j].tags.includes(currDimension + 'X') || that[j].tags.includes(currDimension + 'Y') || that[j].tags.includes(currDimension + 'Z')) {
            
            let distance = inMap ? .001 : 3;
            if (that[j].bot.tags.nearbyMaxDistance) {
                distance = that[j].bot.tags.nearbyMaxDistance;
            }
            const nearbyBots = getBots(inDimension(currDimension), byTag(currDimension + 'X', (value) => {
                if (Math.abs(that[j].bot.tags[currDimension + 'X'] - value) <= distance) {
                    return true;
                }
            }),byTag(currDimension + 'Y', (value) => {
                if (Math.abs(that[j].bot.tags[currDimension + 'Y'] - value) <= distance) {
                    return true;
                }
            }) 
            );

            for (let i = 0; i < nearbyBots.length; ++i) {
                if (nearbyBots[i].vars.recentNearbyNotif != true) {
                    whisper(nearbyBots[i], "onBotNearby", that[j].bot);
                    nearbyBots[i].vars.recentNearbyNotif = true;

                    setTimeout(() => {
                        nearbyBots[i].vars.recentNearbyNotif = null;
                    }, [1000]);
                }
                
            }
        }
    }
}
