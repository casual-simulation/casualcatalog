if (that.bot.tags.mapAvatar && that.bot.tags.ownerID == authBot?.id) {
    if (tags.landmarkIDs && tags.landmarkIDs.length > 0 && tags.landmarkIDs.includes(that.landmarkID)) {
        thisBot.showSelf(that.landmarkID);
    }
}