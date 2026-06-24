const dimension = that?.dimension;
const position = that?.position;

if (thisBot.vars.abBotLastId) {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] destroying abBot`);
    }
    destroy(thisBot.vars.abBotLastId);
}

const abMod = {
    space: 'tempLocal',
    dimension,
    abBot: true,
    [dimension]: true,
    [dimension + 'X']: position.x,
    [dimension + 'Y']: position.y,
    manager: getLink(thisBot),
    remember: tags.remember,
    form: 'nothing',
    label: links.remember.tags.abBaseLabel,
    labelPosition: 'front',
    labelColor: links.personality.tags.abBaseStrokeColor,
    labelSize: 0.61,
    draggable: false,
    armSelection: true,
    armGroupDrag: true,
    armTeleport: true,
    armMultiSelectDefault: true,
    abAllowEquipment: true,
    abEquipmentExclusiveSelect: true,
    armMeshPath: links.remember.tags.abArmMeshPath,
    armColor: links.personality.tags.abBaseStrokeColor,
    personality: tags.personality,
    remember: tags.remember,
    learn: tags.learn,
    search: tags.search,
    abMeshIsStatic: !!links.remember.tags.abMeshIsStatic,
    spinDurationMS: 2000,
    spinIntervalMS: 2000,
    // --- Movement knobs (tile-stepping toward a target, matched to the agent bots) ---
    abMoveSpeed: 4,                 // tiles per second
    abMoveTickIntervalMS: 1000,     // tick cadence — matches the agent's agentCycleIntervalMS
    abMoveBotArriveDistance: 2,     // tiles to stop short of a bot target (matches agent targetDistance)
    soundClick: links.remember.tags.abClickSound ?? true,
    onCreate: ListenerString(async () => {
        let formAddress;

        const instStudioConfig = await links.search.abInstStudioConfig();

        if (thisBot.vars.destroyed) {
            return;
        }

        if (instStudioConfig?.studio_ab_mesh_url) {
            formAddress = instStudioConfig.studio_ab_mesh_url;
        } else if (links.remember.tags.abMeshPath) {
            if (links.remember.tags.abMeshPath.startsWith('https://')) {
                formAddress = links.remember.tags.abMeshPath;
            } else {
                formAddress = links.learn.abBuildCasualCatalogURL(links.remember.tags.abMeshPath);
            }
        }

        if (formAddress) {
            const colorize = instStudioConfig?.studio_ab_mesh_colorize !== false;

            const meshMod = {
                space: 'tempLocal',
                abBot: getLink(thisBot),
                manager: tags.manager,
                name: 'abMeshBot',
                color: colorize ? links.personality.tags.abBaseColor : null,
                form: 'mesh',
                formSubtype: 'gltf',
                formAddress,
                formAnimation: false,
                pointable: false,
                transformer: thisBot.id,
                anchorPoint: 'center',
                [tags.dimension]: true,
                [tags.dimension + 'Z']: -0.5,
            };

            if (!tags.abMeshIsStatic) {
                // Animated mesh: attach the animation state machine so the mesh
                // plays its own idle/click/etc. animations.
                Object.assign(meshMod, links.manager.generateAnimationStateMachineMod({
                    controllerName: 'abBot',
                    gptSourceId: 'abBot',
                    debugAnim: tags.debug
                }));
            }

            // Create the mesh for ab.
            masks.meshBot = getLink(create(meshMod));

            if (!tags.abMeshIsStatic) {
                // Give abBot a reference to the meshBot changeAnimState function.
                thisBot.listeners.changeAnimState = links.meshBot.listeners.changeAnimState;
            }

            tags.form = 'cube';
            tags.color = 'transparent';
            tags.scale = 1;

            if (!tags.abMeshIsStatic) {
                tags.spinIntervalMS = 4500;
            }
        } else {
            // If a custom mesh is not defined for ab, then give ab a "core".
            masks.coreBot = getLink(create({
                space: 'tempLocal',
                abBot: getLink(thisBot),
                color: links.personality.tags.abBaseColor,
                formOpacity: 0.66,
                pointable: false,
                scale: 0.75,
                transformer: thisBot.id,
                anchorPoint: 'center',
                [tags.dimension]: true,
                [tags.dimension + 'Z']: -0.5
            }));

            tags.form = 'cube';
            tags.color = links.personality.tags.abBaseColor;
            tags.scale = 0.9;
            tags.strokeWidth = 1;
            tags.strokeColor = links.personality.tags.abBaseStrokeColor;
            tags.formOpacity = 0.33;
            tags.formDepthTest = false;
        }

        thisBot.animateBot();
        masks.interval = setInterval(() => thisBot.animateBot(), tags.spinIntervalMS);
    }),
    onClick: ListenerString(() => {
        if (links.meshBot && !tags.abMeshIsStatic) {
            links.meshBot.changeAnimState('Click');
        }

        if (that.modality == 'mouse' && that.buttonId == 'right') {
            return;
        }

        if (masks.armBot) {
            destroy(links.armBot);
            masks.armBot = null;
        }

        links.manager.abClick();
    }),
    onPointerEnter:ListenerString(() => {
        if (that.modality === 'mouse') {
            tags.mouseOver = true;
            thisBot.updatePortalCursor();
        }
    }),
    onPointerExit: ListenerString(() => {
        if (that.modality === 'mouse') {
            tags.mouseOver = false;
            thisBot.updatePortalCursor();
        }
    }),
    onPointerDown: ListenerString(() => {
        if (that.modality === 'mouse' && that.buttonId === 'left') {
            tags.mouseLeftButtonDown = true;
            thisBot.updatePortalCursor();
        }
    }),
    onPointerUp: ListenerString(() => {
        if (that.modality === 'mouse' && that.buttonId === 'left') {
            tags.mouseLeftButtonDown = false;
            tags.mouseLeftDragging = false;
            thisBot.updatePortalCursor();
        }
    }),
    onDrag: ListenerString(() => {
        if (tags.mouseLeftButtonDown) {
            tags.mouseLeftDragging = true;
            thisBot.updatePortalCursor();  
        }
    }),
    onKeyDown: ListenerString(() => {
        if (that.keys.includes('Shift')) {
            tags.shiftHeld = true;
            thisBot.updatePortalCursor();  
        }
    }),
    onKeyUp: ListenerString(() => {
        if (that.keys.includes('Shift')) {
            tags.shiftHeld = false;
            thisBot.updatePortalCursor();  
        }
    }),
    updatePortalCursor: ListenerString(() => {
        let cursor = null;

        if (tags.mouseLeftDragging) {
            cursor = 'grabbing';    
        } else if (tags.mouseOver) {
            if (tags.shiftHeld) {
                cursor = 'context-menu';
            } else {
                cursor = 'pointer';
            }
        }

        gridPortalBot.masks.portalCursor = cursor;
    }),
    animateBot: ListenerString(async () => {
        // Animated meshes drive their own motion; static meshes (and ab's core)
        // get the procedural spin, which rotates the child mesh via transformer.
        if (links.meshBot && !tags.abMeshIsStatic) {
            return;
        }

        if (configBot.tags.abOptimized) {
            return;
        }

        const rotZ = tags.dimension + 'RotationZ';

        await animateTag(thisBot,
        {
            fromValue: {
                [rotZ]: 0,
            },
            toValue: {
                [rotZ]: 6.3,
            },
            easing: {
                type: 'sinusoidal',
                mode: 'inout'
            },
            duration: tags.spinDurationMS / 1000,
        }).catch(e => {});
    }),
    abMoveTo: ListenerString(() => {
        // Public entry point. Provide a grid position { x, y } to walk to, or a
        // bot via { bot } to walk to its tile. Pass { followBot: true } to keep
        // chasing the bot as it moves. Calling again mid-move just redirects —
        // the target is re-resolved every tick, so movement is freely interruptable.
        const { x, y, bot, followBot = false } = that ?? {};

        if (bot) {
            const dim = tags.dimension;
            const b = typeof bot === 'string'
                ? getBot('id', bot.startsWith('🔗') ? bot.slice('🔗'.length) : bot)
                : bot;

            // ab can only walk within its own dimension. A missing bot, or one in
            // another dimension, is a no-op rather than a walk toward (0,0).
            if (!b || !b.tags[dim]) {
                console.warn(`[${tagName}] target bot is missing or not in ab's dimension '${dim}' — ignoring move; ab can only walk within its current dimension.`);
                return;
            }

            if (followBot) {
                // Continuous follow: store a link so the tick re-reads its position.
                tags.abMoveTargetBot = getLink(b);
                thisBot.vars.abMovePosition = null;
            } else {
                // One-shot: snapshot the bot's current tile and walk there once.
                tags.abMoveTargetBot = null;
                thisBot.vars.abMovePosition = { x: b.tags[dim + 'X'] ?? 0, y: b.tags[dim + 'Y'] ?? 0 };
            }
        } else {
            // Explicit grid position.
            tags.abMoveTargetBot = null;
            thisBot.vars.abMovePosition = { x: x ?? 0, y: y ?? 0 };
        }

        // A bot target (follow or one-shot) stops short of the bot; an explicit
        // position lands exactly on the tile.
        thisBot.vars.abMoveArriveDist = bot ? (tags.abMoveBotArriveDistance ?? 2) : 0;

        // Reuse the running loop if there is one; otherwise kick one off.
        if (!tags.abMoveIntervalId) {
            thisBot.abMoveTick();
            masks.abMoveIntervalId = setInterval(() => thisBot.abMoveTick(), tags.abMoveTickIntervalMS ?? 1000);
        }
    }),
    abStopMove: ListenerString(() => {
        if (tags.abMoveIntervalId) {
            clearInterval(tags.abMoveIntervalId);
            masks.abMoveIntervalId = null;
        }
        masks.abMoving = false;
        tags.abMoveTargetBot = null;
        thisBot.vars.abMovePosition = null;
        thisBot.vars.abMoveArriveDist = null;
    }),
    abMoveTick: ListenerString(async () => {
        // Skip if a previous tick is still stepping, or ab is gone.
        if (masks.abMoving || thisBot.vars.destroyed) {
            return;
        }

        const dim = tags.dimension;
        if (!dim) {
            return;
        }

        const followingBot = !!links.abMoveTargetBot;

        // Resolve the target tile. A bot target is re-read every tick so ab
        // keeps following it as it moves; a position target is fixed. Coords are
        // rounded so movement stays on whole tiles. No target left → stop.
        let targetX;
        let targetY;
        if (followingBot) {
            // If the followed bot left ab's dimension, idle (keep ticking) so we
            // resume when it returns — never chase a phantom (0,0).
            if (!links.abMoveTargetBot.tags[dim]) {
                return;
            }
            targetX = Math.round(links.abMoveTargetBot.tags[dim + 'X'] ?? 0);
            targetY = Math.round(links.abMoveTargetBot.tags[dim + 'Y'] ?? 0);
        } else if (thisBot.vars.abMovePosition) {
            targetX = Math.round(thisBot.vars.abMovePosition.x);
            targetY = Math.round(thisBot.vars.abMovePosition.y);
        } else {
            thisBot.abStopMove();
            return;
        }

        // Stop distance is fixed when the move is issued (see abMoveTo): a bot
        // target stops short of the bot, an explicit position lands exactly.
        const arriveDist = thisBot.vars.abMoveArriveDist ?? 0;

        const curX = tags[dim + 'X'] ?? 0;
        const curY = tags[dim + 'Y'] ?? 0;
        const dx = curX - targetX;
        const dy = curY - targetY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist <= arriveDist) {
            // Following: idle here but keep ticking so we catch up when the
            // target moves. Fixed position: done — stop and announce arrival.
            if (followingBot) {
                return;
            }
            thisBot.abStopMove();
            shout('onABMoveArrived', { dimension: dim, x: curX, y: curY });
            return;
        }

        // stepsPerTick = tiles to walk this tick at moveSpeed tiles/sec;
        // stepIntervalMS spreads them evenly across the tick.
        const tickIntervalMS = tags.abMoveTickIntervalMS ?? 1000;
        const stepsPerTick = Math.max(1, Math.round((tags.abMoveSpeed ?? 4) * tickIntervalMS / 1000));
        const stepIntervalMS = tickIntervalMS / stepsPerTick;

        masks.abMoving = true;

        for (let i = 0; i < stepsPerTick; i++) {
            // Sleep before steps 2..N so they spread across the tick; step 1
            // runs immediately so the listener finishes before the next tick.
            if (i > 0) await os.sleep(stepIntervalMS);

            if (thisBot.vars.destroyed) {
                break;
            }

            // Re-resolve each step so a redirect or a moving follow-target is
            // picked up immediately.
            let tX;
            let tY;
            if (links.abMoveTargetBot) {
                // Bail if the followed bot left ab's dimension mid-tick.
                if (!links.abMoveTargetBot.tags[dim]) {
                    break;
                }
                tX = Math.round(links.abMoveTargetBot.tags[dim + 'X'] ?? 0);
                tY = Math.round(links.abMoveTargetBot.tags[dim + 'Y'] ?? 0);
            } else if (thisBot.vars.abMovePosition) {
                tX = Math.round(thisBot.vars.abMovePosition.x);
                tY = Math.round(thisBot.vars.abMovePosition.y);
            } else {
                break;
            }

            const cX = tags[dim + 'X'] ?? 0;
            const cY = tags[dim + 'Y'] ?? 0;
            const sdx = cX - tX;
            const sdy = cY - tY;

            if (Math.sqrt(sdx * sdx + sdy * sdy) <= arriveDist) {
                break;
            }

            // One tile along the dominant axis (direct port of the agent step).
            if (Math.abs(tX - cX) >= Math.abs(tY - cY)) {
                tags[dim + 'X'] = cX + Math.sign(tX - cX);
            } else {
                tags[dim + 'Y'] = cY + Math.sign(tY - cY);
            }
        }

        masks.abMoving = false;
    }),
    onABXPEPaidOut: ListenerString(() => {
        const { payAmount, sourceId } = that;

        if (sourceId === 'abBot') {
            ab.cue({ bot: thisBot, text: `🪙-${payAmount}`, wrapMode: 'none', fontSize: 2, color: '#ef4444' });
            whisper(abXPE.links.gui, 'spawnCoins', { targetBot: thisBot, count: payAmount });
        }
    }),
    onArmCreate: ListenerString(() => {
        if (!tags.interval) {
            links.manager.abClick({ reset: true });
        }

        if (links.armBot && links.meshBot && !tags.abMeshIsStatic) {
            const multiSelect = links.armBot.tags.multiSelect;
            if (multiSelect) {
                links.meshBot.changeAnimState('SelectMultiBegin');
            } else {
                links.meshBot.changeAnimState('SelectSingleBegin');
            }
        }
    }),
    onArmPlaced: ListenerString(() => {
        links.remember.masks.abGridFocus = {
            dimension: that.dimension, 
            position: {
                x: that.x,
                y: that.y
            }
        }

        links.manager.abClick({ menu: 'grid' });

        if (links.armBot && links.meshBot && !tags.abMeshIsStatic) {
            const multiSelect = links.armBot.tags.multiSelect;
            if (multiSelect) {
                links.meshBot.changeAnimState('SelectMultiEnd');
            } else {
                links.meshBot.changeAnimState('SelectSingleEnd');
            }
        }

        shout('onABArmPlaced', that);
    }),
    onArmClick: ListenerString(() => {
        links.manager.abClick({ reset: true });
        shout('onABFootClicked', that);
    }),
    onArmSelectedBots: ListenerString(() => {
        const selectedBots = that;

        if (Array.isArray(selectedBots)) {
            // Multiple bot selection.
            links.remember.masks.abMultipleBotFocus = getLink(selectedBots);
            links.manager.abClick({ menu: 'multipleBot' });

            if (links.armBot && links.meshBot && !tags.abMeshIsStatic) {
                links.meshBot.changeAnimState('SelectMultiEnd');
            }
        } else {
            // Single bot selection.
            links.remember.masks.abBotFocus = "🔗" + selectedBots.id;

            if (selectedBots === thisBot) {
                ab.links.menu.abEnvironmentMenu();
            } else {
                links.manager.abClick({ menu: 'bot' });
            }

            if (links.armBot && links.meshBot && !tags.abMeshIsStatic) {
                links.meshBot.changeAnimState('SelectSingleEnd');
            }
        }

        shout('onABSelectedBot', selectedBots);
    }),
    onArmDestroy: ListenerString(() => {
        shout('abMenuRefresh');
    }),
    onABUserRequestTodoCreated: ListenerString(() => {
        if (links.armBot) {
            destroy(links.armBot);
        }

        ab.links.equipment.onEquipmentBaseDeselected(thisBot);
    }),
    onDestroy: ListenerString(() => {
        thisBot.vars.destroyed = true;

        clearInterval(tags.interval);
        clearInterval(tags.abMoveIntervalId);

        if(links.meshBot) {
            destroy(links.meshBot);
        }

        if(links.coreBot) {
            destroy(links.coreBot);
        }

        shout('abMenuRefresh');
    }),
};

const abBot = create(abMod);

if (links.remember.tags.abSecondaryLabel) {
    const abLabelBot = {
        space: 'tempLocal',
        [dimension]: true,
        [dimension + 'Z']: -1,
        creator: abBot.id,
        transformer: abBot.id,
        pointable: false,
        color: 'clear',
        label: links.remember.tags.abSecondaryLabel,
        labelPosition: 'left',
        labelSize: 0.7,
        labelColor: abBot.tags.labelColor,
    };

    create(abLabelBot);
}

masks.abBot = getLink(abBot);
links.remember.masks.abActiveDimension = dimension;
thisBot.vars.abBotLastId = abBot.id; // Storing id as a var prevents ghost abBots during multiple calls in one frame.

// Store the last position of ab in this dimension on the remember bot.
links.remember.masks[dimension + 'ABLastPosition'] = '🧬' + JSON.stringify({ x: position?.x, y: position?.y });

await os.sleep(0); // Give CasualOS a chance to update tag masks.

shout('onABMoved', { dimension, x: position.x, y: position.y });

thisBot.abManifestUserCatalog();

return abBot;