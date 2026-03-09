if (!links.hex) {
    const hex = create({
        space: 'tempLocal',
        form: 'cylinder',
        color: '#00D9CD',
        anchorPoint: 'center',
        manager: getLink(thisBot),
        scale: 0.5,
        scaleZ: 0.2,
        transformer: thisBot.id,
        pointable: false,
        onCreate: ListenerString(() => {
            os.addBotListener(links.manager, 'onBotChanged', (listenerThat) => {
                const changedTags = listenerThat.tags;

                if (changedTags.includes('dimension')) {
                    links.manager.refreshHex();
                }
            })
        }),
        onAnyBotsRemoved: ListenerString(() => {
            const { botIDs } = that;

            if (botIDs.includes(tags.transformer)) {
                destroy(thisBot);
            }
        })
    })

    masks.hex = getLink(hex);
}

if (links.hex.tags.dimension) {
    // Remove hex from its previous dimension.
    const prevDim = links.hex.tags.dimension;
    
    console.log(`[${tags.system}.${tagName}] removing from prevDim:`, prevDim);

    links.hex.tags.dimension = null;
    links.hex.tags[prevDim] = null;
    links.hex.tags[prevDim + 'X'] = null;
    links.hex.tags[prevDim + 'Y'] = null;
    links.hex.tags[prevDim + 'Z'] = null;
    links.hex.tags[prevDim + 'RotationX'] = null;
    links.hex.tags[prevDim + 'RotationY'] = null;
    links.hex.tags[prevDim + 'RotationZ'] = null;
}

if (tags.dimension) {
    // Put hex in the current dimension.
    const curDim = tags.dimension;

    console.log(`[${tags.system}.${tagName}] adding to curDim:`, curDim);

    links.hex.tags.dimension = curDim;
    links.hex.tags[curDim] = true;
    links.hex.tags[curDim + 'X'] = 0;
    links.hex.tags[curDim + 'Y'] = 0;
    links.hex.tags[curDim + 'Z'] = -0.5;
    links.hex.tags[curDim + 'RotationX'] = 0.785398;
    links.hex.tags[curDim + 'RotationY'] = 0;
    links.hex.tags[curDim + 'RotationZ'] = 0;
}