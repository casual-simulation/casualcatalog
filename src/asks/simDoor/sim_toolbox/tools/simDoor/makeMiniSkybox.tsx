tags.anchorPoint = 'center';

const miniSkybox = await create({
    form: 'sphere',
    formAddress: tags.formAddress,
    pointable: false,
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