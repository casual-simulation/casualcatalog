if (tags.todoShowArrow) {
    if (links.arrowBot) {
        // Already have an arrow bot.
        return;
    }

    const arrowFormAddress = ab.abBuildCasualCatalogURL('/asks/meshes/todoBot_arrow.glb');

    // Arrow is completely local, each client manages their own arrow bot.
    // The only thing that is shared about the arrow state is the todo bot's "todoShowArrow" tag that determines 
    // wether its visible or not.
    const arrowBot = create({
        space: 'tempLocal',
        form: 'mesh',
        formSubtype: 'gltf',
        formAddress: arrowFormAddress,
        color: tags.todoBaseColor,
        todoBot: getLink(thisBot),
        transformer: thisBot.id,
        dimension: tags.dimension,
        anchorPoint: [0, 0, -2],
        pointable: false,
        [tags.dimension]: true,
        [tags.dimension + 'X']: 0,
        [tags.dimension + 'Y']: 0,
        [tags.dimension + 'Z']: 0,
        onCreate: ListenerString(async () => {
            tags.formAddressAnimations = await os.listFormAnimations(thisBot);
            
            os.startFormAnimation(thisBot, 'pointingDownArrow_in', {
                initialTime: 0,
                crossFadeWarp: true,
                crossFadeDuration: 200,
                clampWhenFinished: true,
            });
        }),
        onFormAnimationFinished: ListenerString(() => {
            if (that.animation === 'pointingDownArrow_in') {
                os.startFormAnimation(thisBot, 'pointingDownArrow_loop', {
                    crossFadeWarp: true,
                    crossFadeDuration: 200,
                    loop: { mode: 'repeat' },
                });
            }
        }),
        onAnyBotsRemoved: ListenerString(() => {
            const { botIDs } = that;

            if (botIDs.includes(tags.transformer)) {
                destroy(thisBot);
            }
        }),
    })

    masks.arrowBot = getLink(arrowBot);
} else {
    // Destroy arrow bot if it exists.
    if (links.arrowBot) {
        destroy(links.arrowBot);
        masks.arrowBot = null;
    }
}