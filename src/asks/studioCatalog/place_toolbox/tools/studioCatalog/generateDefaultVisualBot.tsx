const formAddress = ab.abBuildCasualCatalogURL('/asks/meshes/book_catalog_icon.glb');

if (links.defaultVisualBot) {
    destroy(links.defaultVisualBot);
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
    baseBotId: getID(thisBot),
    scaleZ: .9,
    scaleX: .5,
    scaleY: .33,
    onFormAnimationFinished: ListenerString(() => {
        const baseBot = getBot('id', tags.baseBotId);
        if (!baseBot || baseBot.tags.hasCustomMesh) {
            return;
        }
        if (baseBot.tags.currentFormAnimation == 'opening') {
            baseBot.tags.currentFormAnimation = 'idle_open';
            tags.formAnimation = 'idle_open';
        } else if (baseBot.tags.currentFormAnimation == 'closing') {
            baseBot.tags.currentFormAnimation = 'closed';
            tags.formAnimation = 'closed';
        }
    }),
    onAnyBotsRemoved: ListenerString(() => {
        const { botIDs } = that;
        if (botIDs.includes(tags.baseBotId)) {
            destroy(thisBot);
        }
    }),
}

const bookBot = create(book);

return bookBot;