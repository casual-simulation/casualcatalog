const presenceData: ABUserPresenceData = that;

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] presenceData:`, presenceData)
}

if (presenceData.camera) {
    const shoutResults = await Promise.allSettled(shout('onABUserCameraUpdate', presenceData));
    const cameraUpdated = shoutResults.length > 0 && shoutResults.some(r => r.value === true);
    
    if (!cameraUpdated) {
        // There was no user camera that accepted the update, need to create a new one.

        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] make user camera:`, presenceData);
        }

        const userCameraBot = create({
            space: 'tempLocal',
            abBot: true,
            abUserCamera: true,
            manager: getLink(thisBot),
            form: 'frustum',
            anchorPoint: 'center',
            remoteId: presenceData.remoteId,
            remoteName: presenceData.remoteName,
            portal: presenceData.portal,
            dimension: presenceData.dimension,
            [presenceData.dimension]: true,
            pointable: false,
            labelPosition: 'floatingBillboard',
            labelWordWrapMode: 'none',
            // labelSize: 0.28,
            // labelSizeMode: 'auto',
            onCreate: ListenerString(() => {
                if (links.manager.tags.debug) {
                    console.log(`[abUserCamera.${tagName} (${tags.remoteName})]`);
                }
            }),
            onABUserCameraUpdate: ListenerString(async () => {
                const presenceData: ABUserPresenceData = that;

                // Make sure that the incoming update is for this bot.
                if (presenceData.remoteId !== tags.remoteId ||
                    presenceData.portal !== tags.portal ||
                    presenceData.dimension !== tags.dimension
                ) {
                    return false;
                }

                // Clear old timeout.
                if (thisBot.vars.timeoutId) {
                    clearTimeout(thisBot.vars.timeoutId);
                    thisBot.vars.timeoutId = null;
                }

                if (links.manager.tags.debug) {
                    console.log(`[abUserCamera.${tagName} (${tags.remoteName})] presenceData:`, presenceData);
                }

                if (tags.label !== presenceData.remoteName) {
                    tags.label = presenceData.remoteName;
                }

                if (tags.color !== presenceData.color) {
                    tags.color = presenceData.color;
                }

                if (tags.labelFloatingBackgroundColor !== presenceData.color){ 
                    tags.labelFloatingBackgroundColor = presenceData.color;
                }

                function clamp01(t: number) {
                    return Math.max(0, Math.min(1, t));
                }

                function zoomToT(zoom: number, zoomMin: number, zoomMax: number) {
                    // t=0 at zoomMin, t=1 at zoomMax
                    const z = Math.max(zoom, 1e-6);
                    const a = Math.log(zoomMin);
                    const b = Math.log(zoomMax);
                    const v = (Math.log(z) - a) / (b - a);
                    return clamp01(v);
                }

                function lerp(a: number, b: number, t: number) {
                    return a + (b - a) * t;
                }

                // Optional smoothing so it doesn’t feel linear / harsh:
                function smoothstep(t: number) {
                    return t * t * (3 - 2 * t);
                }

                // t=0 at zoomMin (zoomed out), t=1 at zoomMax (zoomed in)
                function applyEase(t: number, exponent: number) {
                    // exponent < 1 slows down the “move away” when zooming out
                    // (makes curve gentler near t=0)
                    return Math.pow(smoothstep(t), exponent);
                }

                async function getVizCameraPose(
                    cameraPosition: { x: number; y: number; z: number },
                    cameraRotation: { x: number; y: number; z: number; w: number },
                    cameraType: 'orthographic' | 'perspective',
                    cameraZoom: number | null | undefined,
                    zoomMin = 0.4,
                    zoomMax = 80,
                    farDist = 30,
                    nearDist = 2,
                    exponent = 0.5,
                ) {
                    const pos = new Vector3(cameraPosition.x, cameraPosition.y, cameraPosition.z);
                    
                    let rot;
                    if ((configBot.tags.mapPortal === tags.dimension || configBot.tags.miniMapPortal === tags.dimension) && cameraType === 'perspective') { 
                        rot = await ab.links.utils.calcMapRotation({ mapPosition: cameraPosition, auxRotation: new Rotation({ quaternion: cameraRotation })});
                    } else {
                        rot = new Rotation({ quaternion: cameraRotation });
                    }

                    const forward = rot.rotateVector3(new Vector3(0, 1, 0)).normalize();

                    if (cameraType === 'perspective') {
                        return { position: pos, rotation: rot };
                    }

                    const zoom = Math.max(cameraZoom ?? 10, 1e-6);

                    let t = zoomToT(zoom, zoomMin, zoomMax);
                    t = applyEase(t, exponent);

                    const d = lerp(farDist, nearDist, t);
                    const vizPos = pos.subtract(forward.multiplyScalar(d));

                    return { position: vizPos, rotation: rot, debug: { t, d, zoom } };
                }

                const pose = await getVizCameraPose(
                    presenceData.camera.position,
                    presenceData.camera.quaternion,
                    presenceData.camera.cameraType,
                    presenceData.camera.zoom,
                    0.4,
                    80,
                    0,
                    -427,
                    0.1,
                );

                const posTagName = tags.dimension + 'Position';
                const rotTagName = tags.dimension + 'Rotation';

                clearAnimations(thisBot, [posTagName, rotTagName]);

                if (links.manager.tags.interpolate && tags[posTagName] && tags[rotTagName]) {
                    animateTag(thisBot, {
                        fromValue: {
                            [posTagName]: tags[posTagName],
                            [rotTagName]: tags[rotTagName],
                        },
                        toValue: {
                            [posTagName]: pose.position,
                            [rotTagName]: pose.rotation,
                        },
                        duration: (links.manager.tags.tickIntervalMS + 50) / 1000,
                    }).catch(() => {});
                } else {
                    masks[posTagName] = pose.position;
                    masks[rotTagName] = pose.rotation;
                }

                // Set new timeout.
                thisBot.vars.timeoutId = setTimeout(() => destroy(thisBot), links.manager.tags.cameraBotTimeoutMS);

                return true;
            }),
            onDestroy: ListenerString(() => {
                if (links.manager.tags.debug) {
                    console.log(`[abUserCamera.${tagName} (${tags.remoteName})]`);
                }
            })
        })

        // Directly call onABUserCameraUpdate the first time we make a new user camera bot.
        await userCameraBot.onABUserCameraUpdate(presenceData);
    }
}

if (presenceData.cursors && presenceData.cursors.length > 0) {
    for (let i = 0; i < presenceData.cursors.length; i++) {
        const shoutResults = await Promise.allSettled(shout('onABUserCursorUpdate', { presenceData, cursorIndex: i }));
        const cursorUpdated = shoutResults.length > 0 && shoutResults.some(r => r.value === true);
        
        if (!cursorUpdated) {
            // There was no user cursor that accepted the update, need to create a new one.

            if (tags.debug) {
                console.log(`[${tags.system}.${tagName}] make user cursor:`, presenceData, `cursor:`, presenceData.cursors[i]);
            }

            const cursorBot = create({
                space: 'tempLocal',
                abBot: true,
                abUserCursor: true,
                form: 'nothing',
                anchorPoint: 'center',
                orientationMode: 'billboard',
                pointable: false,
                draggable: false,
                manager: getLink(thisBot),
                remoteId: presenceData.remoteId,
                remoteName: presenceData.remoteName,
                portal: presenceData.portal,
                pointerType: presenceData.cursors[i].pointerType,
                didInitialUpdate: false,
                onCreate: ListenerString(() => {
                    if (links.manager.tags.debug) {
                        console.log(`[abUserCursor.${tagName} (${tags.remoteName})]`);
                    }
                }),
                onABUserCursorUpdate: ListenerString(() => {
                    const presenceData: ABUserPresenceData = that.presenceData;
                    const cursorIndex: number = that.cursorIndex;

                    if (tags.remoteId !== presenceData.remoteId ||
                        tags.portal !== presenceData.portal ||
                        tags.pointerType !== presenceData.cursors[cursorIndex].pointerType ||
                        (tags.pointerType === 'touch' && tags.didInitialUpdate) // Always let touch cursors die.
                    ) {
                        // This update is not for this cursor.
                        return false;
                    }

                    if (links.manager.tags.debug) {
                        console.log('cursor ' + thisBot.id.substring(0,5) + ' update');
                    }

                    thisBot.updatePosition({
                        dimension: presenceData.dimension,
                        position: presenceData.cursors[cursorIndex].position,
                    });

                    thisBot.updateColor({ color: presenceData.color });
                    thisBot.updateName({ name: presenceData.remoteName });

                    thisBot.resetTimeout();

                    tags.didInitialUpdate = true;

                    return true;
                }),
                onGridPortalCameraChanged: ListenerString(() => {
                    thisBot.updateScale();
                }),
                onBotChanged: ListenerString(() => {
                    if (that.tags.some((t) => {
                        return t.endsWith('X') || t.endsWith('Y') || t.endsWith('Z');
                    })) {
                        // Cursor position changed.
                        thisBot.updateScale();
                    }
                }),
                updatePosition: ListenerString(() => {
                    const { dimension, position } = that;
                    
                    if (tags.dimension !== dimension) {
                        // Dimension has changed. 
                        
                        if (tags.dimension) {
                            // Remove the cursor from the previous dimension.
                            tags[ tags.dimension ] = null;
                            links.shapeBot.tags[ tags.dimension ] = null;
                            links.nameBot.tags[ tags.dimension ] = null;

                            // Remove position tags for previous dimension as well.
                            tags[ tags.dimension + 'X' ] = null;
                            tags[ tags.dimension + 'Y' ] = null;
                            tags[ tags.dimension + 'Z' ] = null;
                        }
                            
                        // Set cursor to the current dimension.
                        tags.dimension = dimension;

                        tags[ dimension ] = true;
                        links.shapeBot.tags[ dimension ] = true;
                        links.nameBot.tags[ dimension ] = true;
                    }

                    const dimXTag = dimension + 'X';
                    const dimYTag = dimension + 'Y';
                    const dimZTag = dimension + 'Z';
                    
                    const prevX = tags[ dimXTag ];
                    const prevY = tags[ dimYTag ];
                    const prevZ = tags[ dimZTag ];

                    clearAnimations(thisBot);

                    if (prevX == null && prevY == null && prevZ == null) {
                        // This is the first time setting the position of this cursor in this dimension.
                        // Snap cursor to the position.
                        tags[ dimXTag ] = position.x;
                        tags[ dimYTag ] = position.y;
                        tags[ dimZTag ] = position.z;
                    } else {
                        if (links.manager.tags.interpolate) {
                            // Cursor is already positioned in dimension, smoothly animate to the updated position.
                            animateTag(thisBot, {
                                fromValue: {
                                    [dimXTag]: prevX,
                                    [dimYTag]: prevY,
                                    [dimZTag]: prevZ,
                                },
                                toValue: {
                                    [dimXTag]: position.x,
                                    [dimYTag]: position.y,
                                    [dimZTag]: position.z,
                                },
                                duration: (links.manager.tags.tickIntervalMS + 50) / 1000,
                            }).catch(() => {
                                // Animation canceled, do nothing.
                            });
                        } else {
                            tags[ dimXTag ] = position.x;
                            tags[ dimYTag ] = position.y;
                            tags[ dimZTag ] = position.z;
                        }
                    }
                }),
                updateColor: ListenerString(() => {
                    const { color } = that;

                    if (links.shapeBot.tags.color !== color) {
                        links.shapeBot.tags.color = color;
                    }

                    if (links.nameBot.tags.color !== color) {
                        links.nameBot.tags.color = color;
                    }
                }),
                updateName: ListenerString(() => {
                    const { name } = that;

                    if (links.nameBot.tags.label !== name) {
                        links.nameBot.tags.label = name;
                    }
                }),
                updateScale: ListenerString(() => {
                    const constantScale = links.manager.tags.cursorConstantScale;
                    const inXR = links.manager.tags.inXR;
                    
                    if (inXR ||
                        gridPortalBot.tags.portalCameraType === 'perspective'
                    ) {
                        // perspective scale
                        const cameraPosition = {
                            x: gridPortalBot.tags.cameraPositionX ?? 0,
                            y: gridPortalBot.tags.cameraPositionY ?? 0,
                            z: gridPortalBot.tags.cameraPositionZ ?? 0,
                        };

                        // TODO: This will break when the cursor is in a dimension being displayed by a portal bot.
                        // The fix is to calculate the world position of the bot, but for now im going to skip.
                        const cursorPosition = { 
                            x: tags[ tags.dimension + 'X' ] ?? 0,
                            y: tags[ tags.dimension + 'Y' ] ?? 0,
                            z: tags[ tags.dimension + 'Z' ] ?? 0,
                        };

                        const distance = math.vectorLength( math.subtractVectors(cameraPosition, cursorPosition) );
                        const initialDistance = links.manager.tags.cursorInitialDistance;

                        tags.scale = (distance / initialDistance) * constantScale;
                    } else {
                        // orthographic scale
                        tags.scale = constantScale / gridPortalBot.tags.cameraZoom;
                    }
                }),
                clearTimeout: ListenerString(() => {
                    if (tags.timeoutId) {
                        clearTimeout(tags.timeoutId);
                        tags.timeoutId = null;
                    }
                }),
                resetTimeout: ListenerString(() => {
                    thisBot.clearTimeout();

                    tags.timeoutId = setTimeout(() => {
                        if (links.manager.tags.debug) {
                            console.log('cursor ' + thisBot.id.substring(0,5) + ' has timed out');
                        }

                        destroy(thisBot);
                    }, links.manager.tags.cursorBotTimeoutMS);
                }),
                onDestroy: ListenerString(() => {
                    thisBot.clearTimeout();

                    destroy([
                        links.shapeBot,
                        links.nameBot,
                    ]);
                }),
            })

            const shapeBot = create({
                space: 'tempLocal',
                abBot: true,
                abUserCursor: true,
                formDepthTest: false,
                formDepthWrite: false,
                formRenderOrder: 99999,
                rotationXOffset: 0,
                rotationYOffset: 0,
                rotationZOffset: 0,
                pointable: false,
                draggable: false,
                scale: 0.5,
                transformer: cursorBot.tags.id,
                cursorBot: getLink(cursorBot),
                manager: getLink(thisBot),
                onBotAdded: ListenerString(() => {
                    if (links.cursorBot.tags.pointerType === 'touch') {
                        tags.form = 'mesh';
                        tags.formSubtype = 'gltf';
                        tags.formAddress = links.manager.links.learn.abBuildCasualCatalogURL(links.manager.tags.pingRippleModel);
                        tags.formOpacity = 1;
                        tags.anchorPoint = 'center';

                        const pingRippleModelAnimationDurationMS = 800;

                        // Play a "ping" animation for the touch point.
                        animateTag(thisBot, {
                            fromValue: {
                                scale: tags.scale,
                                formOpacity: tags.formOpacity,
                            },
                            toValue: {
                                scale: tags.scale * 3,
                                formOpacity: 0,
                            },
                            duration: (pingRippleModelAnimationDurationMS) / 1000,
                            easing: {
                                mode: 'out',
                                type: 'sinusoidal',
                            }
                        }).then(() => {
                            // Destroy self once animation ends.
                            destroy(links.cursorBot);
                        })
                        .catch(() => {});
                    } else {
                        tags.form = 'mesh';
                        tags.formSubtype = 'gltf';
                        tags.formAddress = links.manager.tags.cursorModel;
                        tags.anchorPoint = [-0.45, 0.5, 0]
                    }
                })
            });

            const nameBot = create({
                space: 'tempLocal',
                abBot: true,
                abUserCursor: true,
                form: 'cube',
                formDepthTest: false,
                formDepthWrite: false,
                formRenderOrder: 99999,
                anchorPoint: [-0.625, 1.5, 0],
                pointable: false,
                draggable: false,
                scaleX: 3,
                scaleY: 0.6,
                scaleZ: 0.1,
                labelPadding: 0.1,
                transformer: cursorBot.tags.id,
                cursorBot: getLink(cursorBot),
                manager: getLink(thisBot),
            });

            // Give cursor bot links to all of the child bots it needs to communicate with.
            cursorBot.links.shapeBot = shapeBot.link;
            cursorBot.links.nameBot = nameBot.link;

            // Directly call onABUserCursorUpdate the first time we make a new user camera bot.
            await cursorBot.onABUserCursorUpdate({ presenceData, cursorIndex: i });
        }
    }
}