const formAddress = ab.abBuildCasualCatalogURL('/asks/meshes/book_catalog_icon.glb');

if (links.visualBot) {
    destroy(links.visualBot);
}

const book = {
    form: 'mesh',
    formSubtype: 'gltf',
    formAddress: formAddress,
    transformer: getID(thisBot),
    anchorPoint: 'top',
    [tags.dimension]: true,
    [tags.dimension + 'Z']: -1,
    scaleMode: 'absolute',
    meshPositioningMode: 'absolute',
    pointable: false,
    abIgnore: true,
    abCatalogBookBot: true,
    color: abPersonality?.tags?.abBaseColor ?? '#00D9CD',
    baseBot: getLink(thisBot),
    scaleZ: .9,
    scaleX: .5,
    scaleY: .33,
    onFormAnimationFinished: `@
        if (links.baseBot.tags.hasCustomMesh) {
            return;
        }
        if (links.baseBot.tags.currentFormAnimation == 'opening') {
            links.baseBot.tags.currentFormAnimation = 'idle_open';
            tags.formAnimation = 'idle_open';
        } else if (links.baseBot.tags.currentFormAnimation == 'closing') {
            links.baseBot.tags.currentFormAnimation = 'closed';
            tags.formAnimation = 'closed';
        }
    `
}

const bookBot = create(book);

return bookBot;