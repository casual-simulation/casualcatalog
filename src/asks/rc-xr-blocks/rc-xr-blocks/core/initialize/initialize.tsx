if (masks.initialized) {
    return;
}

masks.initialized = true;

gridPortalBot.tags.portalCameraType = 'perspective';
leftWristPortalBot.tags.portalGridScale = 0.025;
rightWristPortalBot.tags.portalGridScale = 0.025;

// Initialize config bot with custom tags and actions.
configBot.tags.inVR = false;
configBot.tags.leftWristPortalName = `${configBot.id}_userMenu`;

configBot.tags.onEnterVR = `@
    tags.inVR = true;
    tags.leftWristPortal = tags.leftWristPortalName;
`;
configBot.tags.onExitVR = `@
    tags.inVR = false;
    tags.leftWristPortal = null;
`;
configBot.tags.inAR = false;
configBot.tags.onEnterAR = `@
    tags.inAR = true;
    tags.leftWristPortal = tags.leftWristPortalName;
`;
configBot.tags.onExitAR = `@
    tags.inAR = false;
    tags.leftWristPortal = null;
`;

if (navigator.userAgent.match(/Android|iPhone|iPad|Windows Phone|Mobile/i)) {
    configBot.tags.isMobile = true;
} else {
    configBot.tags.isMobile = false;
}

// Create the main scene dimension bot.
globalThis.mainSceneBot = create({
    space: 'tempLocal',
    form: 'dimension',
    formAddress: tags.mainSceneDimension,
    [tags.rootDimension]: true,
    [`${tags.rootDimension}X`]: 0,
    [`${tags.rootDimension}Y`]: 0,
    [`${tags.rootDimension}Z`]: 0,
    [`${tags.rootDimension}RotationX`]: 0,
    [`${tags.rootDimension}RotationY`]: 0,
    [`${tags.rootDimension}RotationZ`]: 0,
});

if (tags.showCompass === true) {
    create({
        space: 'tempLocal',
        form: 'sprite',
        formAddress: 'https://builder-ltm-files.s3.amazonaws.com/01744d47743abb827275b7bb865f26e4386039798d9753d521399515dc370fab.png',
        draggable: false,
        pointable: false,
        [tags.mainSceneDimension]: true,
        [`${tags.mainSceneDimension}Z`]: -1.5,
        scale: 3,
    });
}

shout('onSetup');
shout('onInitialize');