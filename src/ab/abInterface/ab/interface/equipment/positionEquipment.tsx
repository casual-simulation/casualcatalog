for (let i = 0; i < that.equipment?.length; ++i) {
    const dimension = configBot.tags.mapPortal ?? configBot.tags.gridPortal ?? that.base.tags.dimension ?? "home";
    const isMap = configBot.tags.mapPortal ? true : false;
    const inRad = isMap ? .0001 : 5;
    const rad = isMap ? .0005 : 7;
    const space = isMap ? .0005 : 1;

    const pos = ab.links.utils.findOpenPositionAround({
        center: new Vector2(that.base.tags[dimension + 'X'], that.base.tags[dimension + 'Y']),
        dimension: dimension,
        innerRadius: inRad,
        radius: rad,
        spacing: space,
    });

    that.equipment[i].tags[dimension + 'X'] = pos.x;
    that.equipment[i].tags[dimension + 'Y'] = pos.y;

    that.equipment[i].tags.lineTo = getID(that.base);
}