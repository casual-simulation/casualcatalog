if (that.modality === 'touch') {
    const dimension = that.dimension;

    // CasualOS does not report the portal that the click took place in, must infer it h    ere.
let portal;

    if (configBot.tags.mapPortal === dimension) {
        portal = 'map';
    } else if (configBot.tags.gridPortal === dimension) {
        portal = 'grid';
    } else if (configBot.tags.miniMapPortal === dimension) {
        portal = 'miniMap';
    } else if (configBot.tags.miniGridPortal === dimension) {
        portal = 'miniGrid';
    }

    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] inferred portal from bot click:`, portal);
    }

    if (portal) {
        // Do a raycast against the current mouse position if a touch pointer clicked a bot.
        // Was able to verify at the time of writing (Jan 19, 2026) that this only occurs for touch_0 so it should be
        // safe to use CasualOS's reported mouse position for this since we dont get a touch position.
        const pointerPosition = os.getPointerPosition('mouse');
        const pointerDirection = os.getPointerDirection('mouse');
        const raycastResult = await os.raycast(portal, pointerPosition, pointerDirection);

        let raycastHit;

        if (raycastResult.botIntersections && raycastResult.botIntersections.length > 0) {
            raycastHit = raycastResult.botIntersections.find((h) => {
                return h.bot.tags.pointable != false
            });
        }

        if (raycastHit) {
            // Add this touch click to the cursor queue for the next tick.
            const cursorQueue: ABUserPresenceQueuedCursorData[] = thisBot.vars.cursorQueue;

            cursorQueue.push({
                pointerType: 'touch',
                dimension,
                position: { x: raycastHit.point.x, y: raycastHit.point.y, z: raycastHit.point.z },
            })

            thisBot.onTick();
        }
    }
}