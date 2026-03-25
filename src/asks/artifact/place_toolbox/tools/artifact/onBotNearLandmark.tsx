if (that.bot.tags.mapAvatar && that.bot.tags.remoteID == getID(configBot)) {
    if (tags.landmarkIDs && tags.landmarkIDs.length > 0 && tags.landmarkIDs.includes(that.landmarkID)) {
        thisBot.showSelf(that.landmarkID);
    }
}