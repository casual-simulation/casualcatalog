if (!tags.imagePrompt && !tags.genForm) {
    return;
}

const image = tags.genForm ?? await ai.generateImage("make me a 3d rendered simulation style icon using this prompt: " + tags.imagePrompt, "text");
if (image) {
    const imageBot = await create({
        formAddress: image,
        pointable: false,
        [tags.dimension]: true,
        anchorPoint: 'center',
        abIgnore: true,
        transformer: getID(thisBot),
        [tags.dimension + 'Z']: -.5,
        [tags.dimension + 'RotationX']: 1.5708,
        blueprintRotationX: 1.5708,
        blueprintZ: -.5,
        blueprint: true,
        onAnyBotDropped: `@
        if (that.bot == thisBot) {
            tags[tags.dimension + 'RotationX'] = 1.5708;
            tags.blueprintRotationX = 1.5708;
        }
        `
    });

    if (links && links.imageBot) {
        destroy(imageBot);
    }
    tags.imageBot = getLink(imageBot);

    tags.color = 'clear';
    tags.strokeColor = null;
    tags.genForm = image;
    tags.scaleX = 2;
    tags.scaleY = 2;
    tags.scaleZ = 2;
}