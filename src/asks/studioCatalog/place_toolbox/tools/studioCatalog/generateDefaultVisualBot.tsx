const formAddress = ab.abBuildCasualCatalogURL('/asks/meshes/book_catalog_icon.glb');

if (links.defaultVisualBot) {
    destroy(links.defaultVisualBot);
}

const book = {
    form: 'mesh',
    formSubtype: 'gltf',
    formAddress: formAddress,
    anchorPoint: 'top',
    [tags.dimension]: true,
    [tags.dimension + 'X']: tags[tags.dimension + 'X'],
    [tags.dimension + 'Y']: tags[tags.dimension + 'Y'],
    scaleMode: 'absolute',
    scale: .5,
    meshPositioningMode: 'absolute',
    pointable: false,
    abIgnore: true,
    abCatalogBookBot: true,
    formAnimation: ['closed_static'],
    color: abPersonality?.tags?.abBaseColor ?? '#00D9CD',
    baseBotId: getID(thisBot),
    onAnyBotsRemoved: ListenerString(() => {
        const { botIDs } = that;
        if (botIDs.includes(tags.baseBotId)) {
            destroy(thisBot);
        }
    })
}

const bookBot = create(book);

return bookBot;