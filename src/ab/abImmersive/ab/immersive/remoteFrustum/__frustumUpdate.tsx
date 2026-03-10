if ( !globalThis.matrix4 || !globalThis.transform ) {
    // Need to wait for the math and transform libraries to be loaded.
    return;
}

const camPos = {
    x: gridPortalBot.tags.cameraPositionX,
    y: gridPortalBot.tags.cameraPositionY,
    z: gridPortalBot.tags.cameraPositionZ,
};

const camRot = new Rotation({
    euler: {
        x: gridPortalBot.tags.cameraRotationX,
        y: gridPortalBot.tags.cameraRotationY,
        z: gridPortalBot.tags.cameraRotationZ,
    }
});

const frustumDim = tags.currentDimension;

if ( globalThis.mainSceneBot && frustumDim === links.immersiveManager.tags.mainSceneDimension ) {
    // Translate camera's gridPortal position to be in mainScene local space.
    const msMatrix = matrix4.worldMatrixFromBot( mainSceneBot, 'home' );
    const camLocalPos = vector3.worldToLocal( {...camPos}, msMatrix );
    transform.setBotPosition( thisBot, frustumDim, camLocalPos );

    // Find point in front of camera that we can:
    // 1. Translate to mainScene local space.
    // 2. Calculate a look rotation with.
    const camForward = math.getForwardDirection( camRot );
    let lookPoint = math.addVectors( {...camPos}, math.scaleVector( camForward, 4) );
    lookPoint = vector3.worldToLocal( {...lookPoint}, msMatrix );

    transform.lookAtPoint(thisBot, frustumDim, lookPoint);
} else {
    // Use camera's gridPortal position as-is.
    transform.setBotPosition( thisBot, frustumDim, camPos );
    transform.setBotRotation( thisBot, frustumDim, camRot );
}
