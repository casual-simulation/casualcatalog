const landmarkBot = getBot("landmarkID", that);

if (tags.collected) {
    return;
} else {
    const dimension = tags.dimension ?? configBot.tags.mapPortal ?? configBot.tags.gridPortal;
    const isMap = configBot.tags.mapPortal ? true : false;
    const inRad = isMap ? .0001 : 3;
    const rad = isMap ? .0005 : 5;
    const space = isMap ? .0005 : 1;

    const pos = ab.links.utils.findOpenPositionAround({center: new Vector2(landmarkBot.tags[dimension + 'X'], landmarkBot.tags[dimension + 'Y']), dimension: dimension, innerRadius: inRad, radius: rad, spacing: space})

    setTagMask(thisBot, "home", true, "tempLocal");
    setTagMask(thisBot, "homeX", pos.x, "tempLocal");
    setTagMask(thisBot, "homeY", pos.y, "tempLocal");
    setTagMask(thisBot, "collectable", true, "tempLocal");
    setTagMask(thisBot, "pointable", true, "tempLocal");
}   