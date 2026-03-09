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
    form: 'cube',
    label: links.remember.tags.abBaseLabel,
    labelPosition: 'front',
    labelColor: links.personality.tags.abBaseStrokeColor,
    labelSize: 0.61,
    draggable: false,
    armSelection: true,
    armGroupDrag: true,
    armTeleport: true,
    armMeshPath: links.remember.tags.abArmMeshPath,
    armColor: links.personality.tags.abBaseStrokeColor,
    personality: tags.personality,
    remember: tags.remember,
    learn: tags.learn,
    spinDurationMS: 2000,
    spinIntervalMS: 2000,
    soundClick: links.remember.tags.abClickSound ?? true,
    onCreate: ListenerString(() => { 
        if (links.remember.tags.abMeshPath) {
            let formAddress;

            if (links.remember.tags.abMeshPath.startsWith('https://')) {
                formAddress = links.remember.tags.abMeshPath;
            } else {
                formAddress = links.learn.abBuildCasualCatalogURL(links.remember.tags.abMeshPath);
            }

            const animationStateMachineMod = links.manager.generateAnimationStateMachineMod({
                controllerName: 'abBot',
                gptSourceId: 'abBot',
                debugAnim: tags.debug
            })

            // Create the mesh for ab.
            masks.meshBot = getLink(create({
                space: 'tempLocal',
                abBot: getLink(thisBot),
                manager: tags.manager,
                name: 'abMeshBot',
                color: links.personality.tags.abBaseColor,
                form: 'mesh',
                formSubtype: 'gltf',
                formAddress,
                formAnimation: false,
                pointable: false,
                transformer: thisBot.id,
                anchorPoint: 'center',
                [tags.dimension]: true,
                [tags.dimension + 'Z']: -0.5,
                ...animationStateMachineMod
            }));

            // Give abBot a reference to the meshBot changeAnimState function.
            thisBot.listeners.changeAnimState = links.meshBot.listeners.changeAnimState;

            tags.color = 'transparent';
            tags.scale = 1;
            tags.spinIntervalMS = 4500;
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
        if (links.meshBot) {
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
        if (links.meshBot) {
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

        if (links.armBot && links.meshBot) {
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

        if (links.armBot && links.meshBot) {
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

            if (links.armBot && links.meshBot) {
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

            if (links.armBot && links.meshBot) {
                links.meshBot.changeAnimState('SelectSingleEnd');
            }
        }

        shout('onABSelectedBot', selectedBots);
    }),
    onArmDestroy: ListenerString(() => {
        shout('abMenuRefresh');
    }),
    onDestroy: ListenerString(() => {
        clearInterval(tags.interval);
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

return abBot;