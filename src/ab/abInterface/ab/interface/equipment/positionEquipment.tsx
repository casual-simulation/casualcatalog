for (let i = 0; i < that.equipment?.length; ++i) {
    const dimension = configBot.tags.mapPortal ?? configBot.tags.gridPortal ?? that.base?.tags.dimension ?? "home";
    const isMap = configBot.tags.mapPortal ? true : false;
    const inRad = isMap ? (that.equipment[i].tags.abEquipmentInnerRadius_map ?? .0001) : (that.equipment[i].tags.abEquipmentInnerRadius_grid ?? 5);
    const rad = isMap ? (that.equipment[i].tags.abEquipmentOuterRadius_map ?? .0005) : (that.equipment[i].tags.abEquipmentOuterRadius_grid ?? 7);
    const space = isMap ? (that.equipment[i].tags.abEquipmentSpacing_map ?? .0005) : (that.equipment[i].tags.abEquipmentSpacing_grid ?? 1);

    const pos = ab.links.utils.findOpenPositionAround({
        center: new Vector2(that.base?.tags[dimension + 'X'] ?? 0, that.base?.tags[dimension + 'Y'] ?? 0),
        dimension: dimension,
        innerRadius: inRad,
        radius: rad,
        spacing: space,
        preferAngle: 0
    });

    that.equipment[i].tags[dimension + 'X'] = pos.x ?? 0;
    that.equipment[i].tags[dimension + 'Y'] = pos.y ?? 0;

    that.equipment[i].tags.lineTo = getID(that.base);
}