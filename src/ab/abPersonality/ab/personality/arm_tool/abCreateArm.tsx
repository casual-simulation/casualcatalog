const originBot = that.originBot;
assert(ab.links.utils.isBot(originBot), `[${tags.system}.${tagName}] originBot is a required Bot parameter.`);

const dimension = that.dimension;
assert(typeof dimension === 'string', `[${tags.system}.${tagName}] dimension is a required string parameter.`);

const position = that.position ?? getBotPosition(originBot, dimension);
const multiSelect = that.multiSelect ?? false;
const armColor = that.armColor ?? originBot.tags.armColor ?? originBot.tags.strokeColor ?? originBot.tags.color;
const armMeshPath = that.armMeshPath ?? originBot.tags.armMeshPath;
const armDropSound = that.armDropSound ?? originBot.tags.armDropSound;
const armTeleportSound = that.armTeleportSound ?? originBot.tags.armTeleportSound;

const arm = {
    space: 'tempLocal',
    [dimension]: true,
    [dimension + 'X']: position.x,
    [dimension + 'Y']: position.y,
    [dimension + 'Z']: position.z,
    creator: originBot.id,
    isArmBot: true,
    pointable: true,
    multiSelect,
    debug: tags.debug,
    originBot: getLink(originBot),
    dimension,
    armColor,
    armMeshPath,
    armDropSound,
    armTeleportSound,
    defaultArmDropSound: tags.defaultArmDropSound,
    defaultArmTeleportSound: tags.defaultArmTeleportSound,
    lineColor: armColor,
    lineTo: originBot.id,
    onCreate: ListenerString(() => {
        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] created armBot ${thisBot.id}`);
        }
        // Destroy previous arm if it is still around.
        if (links.originBot.masks.armBot) {
            destroy(links.originBot.links.armBot);
        }

        tags.system = `arm.${thisBot.id.substring(0, 5)}`;
        links.originBot.masks.armBot = getLink(thisBot);
        links.originBot.masks.draggable = tags.multiSelect;

        if (tags.armMeshPath && !tags.multiSelect) {
            if (tags.armMeshPath.startsWith('https://')) {
                tags.formAddress = tags.armMeshPath;
            } else {
                tags.formAddress = ab.abBuildCasualCatalogURL(tags.armMeshPath);
            }

            tags.form = 'mesh';
            tags.formSubtype = 'gltf';
            tags.anchorPoint = 'center';
            tags.color = tags.armColor;
            tags.scale = 0.9999; // There is a really strange bug that if this is left undefined or set to 1 exactly, the arm will sometimes disappear.
        } else {
            tags.strokeColor = tags.armColor;
            tags.form = 'cube';
            tags.color = 'clear';
            tags.scale = 0.9;
            tags.scaleZ = 0.01;

            if (tags.multiSelect) {
                tags.form = 'sphere';
                tags.color = tags.armColor;
            }
        }

        // Make the origin bot unselectable for 1/4 of a second.
        // This helps prevent unintentional self-selection of the origin bot.
        links.originBot.masks.pointable = false;
        os.sleep(250).then(() => {
            links.originBot.masks.pointable = null;
        })

        thisBot.originClearSelection();

        whisper(links.originBot, 'onArmCreate');
    }),
    setArmVisible: ListenerString(() => {
        let visible = that;

        if (visible) {
            if (tags.armMeshPath) {
                masks.formOpacity = null;
            } else {
                masks.strokeColor = null;
            }

            masks.lineColor = null;
            masks.lineTo = links.originBot.id; 
            masks.pointable = null;

            if (tags.multiSelect) {
                masks.color = null;
            }
        } else {
            if (tags.armMeshPath) {
                masks.formOpacity = 0;
            } else {
                masks.strokeColor = 'clear';
            }

            masks.lineColor = 'clear';
            masks.lineTo = false;
            masks.pointable = false;

            if (tags.multiSelect) {
                masks.color = 'clear';
            }
        }
    }),
    onClick: ListenerString(() => {
        const { dimension } = that;

        if (links.originBot?.tags.armTeleport ?? true) {
            links.originBot.tags[dimension] = true;
            links.originBot.tags[dimension + 'X'] = tags[dimension + 'X'];
            links.originBot.tags[dimension + 'Y'] = tags[dimension + 'Y'];
            links.originBot.tags[dimension + 'Z'] = tags[dimension + 'Z'];

            ab.links.sound.abPlaySound({ value: tags.armTeleportSound, defaultValue: tags.defaultArmTeleportSound });
        }

        whisper(links.originBot, 'onArmClick', { dimension });

        destroy(thisBot);
    }),
    onDropEnter: ListenerString(() => {
        if (that.dragBot !== thisBot) return;
        if (!links.originBot) return;

        const dropBot = that.to.bot;

        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] that:`, that);
        }

        links.originBot.masks.lineColor = tags.armColor;

        if (tags.multiSelect) {
            let lineToBots = links.originBot.links.lineTo;

            if (lineToBots == null) {
                links.originBot.masks.lineTo = getLink(dropBot);
            } else {
                lineToBots = Array.isArray(lineToBots) ? lineToBots : [lineToBots];

                if (!lineToBots.includes(dropBot)) {
                    links.originBot.masks.lineTo = getLink(...lineToBots, dropBot);
                }
            }
        } else {
            thisBot.setArmVisible(false);

            if (tags.debug) {
                console.log(`[${tags.system}.${tagName}] hide arm`);
            }

            links.originBot.masks.lineTo = dropBot.id;

            if (tags.debug) {
                console.log(`[${tags.system}.${tagName}] show selection on origin bot.`);
            }
        }
    }),
    onDropExit: ListenerString(() => {
        if (that.dragBot !== thisBot) return;
        if (!links.originBot) return;

        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] that:`, that);
        }

        const dropBot = that.to.bot;

        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] dropBot:`, dropBot);
        }

        if (!tags.multiSelect) {
            thisBot.setArmVisible(true);

            if (tags.debug) {
                console.log(`[${tags.system}.${tagName}] show arm`);
            }

            links.originBot.masks.lineTo = null;

            if (tags.debug) {
                console.log(`[${tags.system}.${tagName}] show selection on origin bot.`);
            }
        }
    }),
    onDrop: ListenerString(() => {
        if (that.bot !== thisBot) return;

        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] that:`, that);
        }
        
        const dropBot = that.to.bot;

        ab.links.sound.abPlaySound({ value: tags.armDropSound, defaultValue: tags.defaultArmDropSound });
        
        if (tags.multiSelect && links.originBot.links.lineTo) {
            thisBot.setArmVisible(false);
            thisBot.originSetSelection(links.originBot.links.lineTo);
        } else if (dropBot) {
            thisBot.setArmVisible(false);
            thisBot.originSetSelection(dropBot);
        } else {
            // Dropped on grid.
            if (tags.debug) {
                console.log(`[${tags.system}.${tagName}] dropped on grid.`);
            }

            whisper(links.originBot, 'onArmPlaced', { dimension: that.to.dimension, x: that.to.x, y: that.to.y, z: that.to.z });
        }
        
    }),
    onGridClick: ListenerString(() => {
        thisBot.originClearSelection();
        destroy(thisBot);
    }),
    originClearSelection: ListenerString(() => {
        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] that:`, that);
        }
        
        links.originBot.masks.armSelectedBots = null;
        links.originBot.masks.lineColor = null;
        links.originBot.masks.lineTo = null;
    }),
    originSetSelection: ListenerString(() => {
        const selectedBots = that;

        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] that:`, that);
        }

        links.originBot.masks.armSelectedBots = selectedBots ? getLink(selectedBots) : null;
        links.originBot.masks.lineColor = tags.armColor;
        links.originBot.masks.lineTo = links.originBot.tags.armSelectedBots;
        
        if (links.originBot.links.armSelectedBots) {
            whisper(links.originBot, 'onArmSelectedBots', links.originBot.links.armSelectedBots)
        }
    }),
    onAnyBotsRemoved: ListenerString(() => {
        if (!links.originBot) {
            destroy(thisBot);
            return;
        }

        if (links.originBot.masks.armSelectedBots) {
            // Check that we still have some active selected bots.
            let activeSelectedBots = false;

            const armSelectedBots = links.originBot.links.armSelectedBots;

            if (Array.isArray(armSelectedBots)) {
                activeSelectedBots = armSelectedBots.every(b => !!b);
            } else {
                activeSelectedBots = !!armSelectedBots;
            }

            if (!activeSelectedBots) {
                // If the bots we had selected no longer exist, destroy this arm.
                if (tags.debug) {
                    console.log(`[${tags.system}.${tagName}] bots that arm has selected no longer exist, destroy this arm.`);
                }

                thisBot.originClearSelection();
                destroy(thisBot);
            } else {
                if (tags.debug) {
                    console.log(`[${tags.system}.${tagName}] bots that arm has selected still has active bots.`);
                }
            }
        }
    }),
    onDestroy: ListenerString(() => {
        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] that:`, that);
        }

        if (links.originBot) {
            links.originBot.masks.armBot = null;
            links.originBot.masks.draggable = null;
            whisper(links.originBot, 'onArmDestroy');
        }
    }),
};

const armBot = create(arm);

return armBot;