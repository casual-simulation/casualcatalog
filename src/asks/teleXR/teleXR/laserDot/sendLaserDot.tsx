if (!masks.initialized) {
    return;
}

const pointing = tags.pointing;

if (pointing) {
    // Infer pointer type using modality and hand.
    let pointer;

    if (pointing.modality === 'mouse') {
        pointer = 'mouse';
    } else if (pointing.modality === 'controller') {
        if (pointing.hand === 'left') {
            pointer = 'left'
        } else {
            pointer = 'right';
        }
    }

    if (pointer) {
        const pointingBot = getBot('id', pointing.botId);
        const pointerPos = os.getPointerPosition(pointer);
        const pointerDir = os.getPointerDirection(pointer);

        const raycastResult = await os.raycast('grid', pointerPos, pointerDir);
        const pointingBotHit = raycastResult.botIntersections.find(i => i.bot.id === pointingBot.id);

        if (pointingBotHit) {
            // Convert hit point from world space into local space of the pointingBot.
            const matrixWorld = TeleXR.math.matrix4.worldMatrixFromBot(pointingBot, pointingBotHit.dimension);
            const hitPointLocal = TeleXR.math.vector3.worldToLocal(pointingBotHit.point, matrixWorld);

            const remoteData = {
                botId: pointingBot.id,
                botSpace: pointingBot.space,
                botType: 'normal',
                hitPointLocal,
                dimension: pointingBotHit.dimension,
                hitUV: pointingBotHit.uv,
                modality: pointing.modality,
                hand: pointing.hand,
                remoteId: configBot.tags.id, 
                color: links.laserColor.tags.color,
            }

            if (pointingBot.tags.videoBot) {
                // Add some extra data for videoBots.
                remoteData.botType = 'videoBot';
                remoteData.videoFormAddress = pointingBot.tags.formAddress;
            }

            const remoteIds = await os.remotes();

            if (tags.debug) {
                console.log(`[${tags.system}.${tagName}] sending remotes laser_dot_update:`, remoteData);
            }

            sendRemoteData(remoteIds, 'laser_dot_update', remoteData);
        }
    } else {
        if (tags.debug) {
            console.warn(`[${tags.system}.${tagName}] pointer type is unsupported.`)
        }
    }

}