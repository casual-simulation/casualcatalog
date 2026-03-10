thisBot.arWebSlingerMenuReset();

configBot.masks.leftWristPortal = "arWebSlinger_leftWrist";
configBot.masks.rightWristPortal = "arWebSlinger_rightWrist";

// Need to move out of the mapPortal if we are in it.
masks.mapPortalBeforeAR = configBot.tags.mapPortal;

if (configBot.tags.mapPortal) {
    configBot.tags.mapPortal = null;

    if (!configBot.tags.gridPortal) {
        configBot.tags.gridPortal = masks.mapPortalBeforeAR;
    }
}

// Make this manager bot into a exit ar/vr button. Put it in the wrist portal.
masks.onClick = `@thisBot.onExitClick();`;
masks.label = "X";
masks.form = null;
masks.formOpacity = 1;
masks.draggable = false;
masks.color = "clear";
masks.scaleZ = 0.1;
masks.labelColor = "#FFFFFF";
masks.onPointerEnter = "@ masks.scale = 1.1;";
masks.onPointerExit = "@ masks.scale = null;";
masks[tags.dimension] = false;
masks[configBot.masks.leftWristPortal] = true;
masks[configBot.masks.leftWristPortal + 'X'] = 3.2;
masks[configBot.masks.leftWristPortal + 'Y'] = 3;
masks[configBot.masks.leftWristPortal + 'Z'] = 0;
masks.isXRSetup = true;

const hexBot = getBot("transformer", thisBot.id);
hexBot.masks.color = "clear";

// Create log window.
thisBot.createLogWindow({
    dimension: configBot.tags.leftWristPortal,
    position: new Vector3(5.5, 1, 0),
    // width: 5,
    // height: 5,
})

if (tags.devMode) {
    // Create portal bots in the current dimension for the left and right wristportals so we can easily see whats going on during dev.
    create({
        space: 'tempLocal',
        form: 'portal',
        formAddress: configBot.tags.leftWristPortal,
        [tags.dimension]: true,
        [tags.dimension + 'X']: -10,
        [tags.dimension + 'Y']: 0,
        onABWebSlingerTeardown: ListenerString(() => {
            destroy(thisBot);
        })
    })

    create({
        space: 'tempLocal',
        form: 'portal',
        formAddress: configBot.tags.rightWristPortal,
        [tags.dimension]: true,
        [tags.dimension + 'X']: 10,
        [tags.dimension + 'Y']: 0,
        onABWebSlingerTeardown: ListenerString(() => {
            destroy(thisBot);
        })
    })
}

shout('onABWebSlingerSetup', { devMode: tags.devMode });