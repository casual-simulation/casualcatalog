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
    scale: .7,
    meshPositioningMode: 'absolute',
    pointable: false,
    abIgnore: true,
    abCatalogBookBot: true,
    formAnimation: 'closed',
    color: abPersonality?.tags?.abBaseColor ?? '#00D9CD',
    baseBotId: getID(thisBot),
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
            
            const manifestation = getBot(byID(baseBot.tags.abEquipmentFor));
            if (!manifestation.tags.abEquipmentSelected) {
                baseBot.hideCatalog();
            }
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