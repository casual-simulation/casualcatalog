const miniSkybox = await create({
    form: 'mesh',
    formSubtype: 'splat',
    formAddress: tags.lowRes,
    pointable: false,
    color: tags.formAddress ? null: tags.color,
    scale: 1.1,
    [tags.dimension]: true,
    anchorPoint: 'center',
    [tags.dimension + "RotationX"]: 1.5708,
    abIgnore: true,
    transformer: getID(thisBot),
    onAnyBotDrop: `@if (that.bot == thisBot) {  
        tags[tags.dimension + "RotationX"] = 1.5708;
    }`
});

if (links && links.miniSkybox) {
    destroy(miniSkybox);
}
tags.miniSkybox = getLink(miniSkybox);