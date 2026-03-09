if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] start`);
}

if (!thisBot.getPresenceEnabled()) {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] ignoring tick — presence is disabled.`);
    }
    return;
}

if (!configBot) {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] ignoring tick — waiting for configBot to be ready.`);
    }
    return;
}

if (!globalThis.ab) {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] ignoring tick — waiting for ab to be ready.`);
    }
    return;
}

if (configBot.tags.sheetPortal) {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] ignoring tick — waiting to leave sheet portal.`);
    }
    return;
}

if (configBot.tags.systemPortal) {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] ignoring tick — waiting to leave system portal.`);
    }
    return;
}

// Get list of relevant presence data from portals & dimensions that the user is active in.
const presenceDataToEmit: ABUserPresenceData[] = [];

// Make a copy of the current cursor queue and reset it. Current cursor queue will be processed in this tick.
const cursorQueue: ABUserPresenceQueuedCursorData[] = [...(thisBot.vars.cursorQueue ?? [])];
thisBot.vars.cursorQueue = [];

async function tryGeneratePresenceDataForPortal(portal: string): ABUserPresenceData | null {
    const inMap = portal === 'map' || portal === 'miniMap';
    const dimension = os.getPortalDimension(portal);
    const portalBot = globalThis[portal + 'PortalBot'];

    if (!portal) {
        return null;
    }

    if (!dimension) {
        return null;
    }

    if (!portalBot) {
        throw new Error(`[${tags.system}.${tagName}.tryGeneratePresenceDataForPortal] unable to find ${portal} portal bot.`);
    }
    
    const presenceData: ABUserPresenceData = {
        remoteId: configBot.id,
        remoteName: thisBot.getRemoteName(),
        portal,
        dimension,
        color: thisBot.getRemoteColor(),
        camera: undefined,
        cursors: undefined,
    }

    const cameraSupported = portal === 'grid' || portal === 'miniGrid' || portal === 'map' || portal === 'miniMap';

    if (tags.cameraEnabled && cameraSupported) {
        presenceData.camera = {
            cameraType: inMap ? 'perspective' : (portalBot.tags.portalCameraType ?? 'orthographic'),
            position: inMap ? portalBot.tags.cameraMapPosition : portalBot.tags.cameraPosition,
            quaternion: portalBot.tags.cameraRotation.quaternion,
            zoom: portalBot.tags.cameraZoom,
        };
    }

    const cursorSupported = portal === 'grid' || portal === 'miniGrid';

    if (tags.cursorEnabled && cursorSupported) {
        async function generatePointerCursorData(pointer: 'mouse' | 'left' | 'right'): ABUserPresenceCursorData {
            const pointerPosition = os.getPointerPosition(pointer);
            const pointerDirection = os.getPointerDirection(pointer);
            const raycastResult = await os.raycast(portal, pointerPosition, pointerDirection);

            let raycastHit;

            if (raycastResult.botIntersections && raycastResult.botIntersections.length > 0) {
                raycastHit = raycastResult.botIntersections.find((h) => {
                    return h.bot.tags.pointable != false
                });
            }

            if (raycastHit) {
                return {
                    pointerType: pointer,
                    position: { x: raycastHit.point.x, y: raycastHit.point.y, z: raycastHit.point.z },
                }
            } else {
                // Didn't hit any bots.
                // Try testing against the ground plane.
                const groundPoint = math.intersectPlane(pointerPosition, pointerDirection);

                if (groundPoint != null) {
                    return {
                        pointerType: pointer,
                        position: { x: groundPoint.x, y: groundPoint.y, z: groundPoint.z },
                    }
                } else {
                    // Not intersecting with anything right so so lets just get a point some distance down the 
                    // pointer's ray and call it good.
                    const floatingPoint = {
                        x: pointerPosition.x + pointerDirection.x * tags.floatingCursorDistance,
                        y: pointerPosition.y + pointerDirection.y * tags.floatingCursorDistance,
                        z: pointerPosition.z + pointerDirection.z * tags.floatingCursorDistance,
                    }

                    return {
                        pointerType: pointer,
                        position: floatingPoint,
                    }
                }
            }
        }

        const cursors: ABUserPresenceCursorData[] = [];

        if (masks.inXR) {
            if (configBot.tags.leftPointerPortal === portal) {
                cursors.push(await generatePointerCursorData('left'));
            }

            if (configBot.tags.rightPointerPortal === portal) {
                cursors.push(await generatePointerCursorData('right'));
            }
        } else {
            if (!thisBot.isUsingTouch()) {
                if (configBot.tags.mousePointerPortal === portal) {
                    cursors.push(await generatePointerCursorData('mouse'));
                }
            } else {
                if (tags.debug) {
                    console.log(`[${tags.system}.${tagName}] ignoring 'mouse' cursor data, touch is the input being used.`);
                }
            }
        }

        // Add any cursors in the current dimension from the external queue into the outgoing presence data.
        if (cursorQueue && cursorQueue.length > 0) {
            for (let i = cursorQueue.length - 1; i >= 0; i--) {
                if (cursorQueue[i].dimension === dimension) {
                    cursors.push({
                        pointerType: cursorQueue[i].pointerType,
                        position: cursorQueue[i].position,
                    })

                    cursorQueue.splice(i, 1);
                }
            }
        }

        if (cursors.length) {
            presenceData.cursors = cursors;
        }
    }

    if (presenceData.camera || (presenceData.cursors && presenceData.cursors.length > 0)) {
        return presenceData;
    } else {
        return null;
    }
}

// Map portal sits on top the grid portal so only send map portal camera if its enabled.
if (configBot.tags.mapPortal) {
    const presenceData = await tryGeneratePresenceDataForPortal('map');
    if (presenceData) {
        presenceDataToEmit.push(presenceData);
    }
} else if (configBot.tags.gridPortal) {
    const presenceData = await tryGeneratePresenceDataForPortal('grid');
    if (presenceData) {
        presenceDataToEmit.push(presenceData);
    }
}

// Mini map portal sits on top the mini map portal so only send mini map portal camera if its enabled.
if (configBot.tags.miniMapPortal) {
    const presenceData = await tryGeneratePresenceDataForPortal('miniMap');
    if (presenceData) {
        presenceDataToEmit.push(presenceData);
    }
} else if (configBot.tags.miniGridPortal) {
    const presenceData = await tryGeneratePresenceDataForPortal('miniGrid');
    if (presenceData) {
        presenceDataToEmit.push(presenceData);
    }
}

if (presenceDataToEmit.length === 0) {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] ignoring tick — waiting to be in a portal with presence data.`);
    }
    return;
}

const otherRemotes = (await os.remotes()).filter(id => id !== configBot.id);

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] presenceDataToEmit:`, presenceDataToEmit, `otherRemotes:`, otherRemotes);
}

if (otherRemotes.length > 0) {
    sendRemoteData(otherRemotes, 'ab_user_presence_data', presenceDataToEmit);
}