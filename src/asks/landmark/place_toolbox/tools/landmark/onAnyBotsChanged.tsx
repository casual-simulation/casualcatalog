// for (let j = 0; j < that.length; ++j) {
//     if (that[j].bot && that[j].bot.tags.mapAvatar == true && that[j].bot.tags.remoteID == getID(configBot)) {
//         const isNearby = await links.navigation.isNearby({bot1: thisBot, bot2: that[j].bot});
//         if (isNearby) {
//             if (tags.nearbyPlayer != getID(that[j].bot)) {
//                 setTagMask(thisBot, "nearbyPlayer", getID(that[j].bot));
//             }
//         } else {
//             if (tags.nearbyPlayer) {
//                 setTagMask(thisBot, "nearbyPlayer", null);
//             }
//         }
//     }
// }