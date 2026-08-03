if (that.bot == ab.links.manifestation.links.abBot) {
    if (tags.landmarkIDs && tags.landmarkIDs.length > 0 && tags.landmarkIDs.includes(that.landmarkID)) {
        thisBot.showSelf(that.landmarkID);
    }
}