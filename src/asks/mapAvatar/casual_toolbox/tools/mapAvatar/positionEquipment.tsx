for (let i = 0; i < tags.equipment?.length; ++i) {
    const dimension = tags.dimension ?? configBot.tags.mapPortal ?? configBot.tags.gridPortal;
    const isMap = configBot.tags.mapPortal ? true : false;
    const inRad = isMap ? .0001 : 5;
    const rad = isMap ? .0005 : 7;
    const space = isMap ? .0005 : 1;

    const pos = ab.links.utils.findOpenPositionAround({
        center: new Vector2(tags[dimension + 'X'], tags[dimension + 'Y']),
        dimension: dimension,
        innerRadius: inRad,
        radius: rad,
        spacing: space,
    });

    const equipmentBot = getBot("equipmentId", tags.equipment[i]);
    equipmentBot.tags[dimension + 'X'] = pos.x;
    equipmentBot.tags[dimension + 'Y'] = pos.y;

    equipmentBot.tags.lineTo = getID(thisBot);
}