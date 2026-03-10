const menu3dBots = [];

const MENU3DBOT_BASE_TAGS = {
    space: 'tempLocal',
    manager: getLink(links.manager),
    menu3dBotPool: getLink(thisBot),
    menu3dPortalBot: tags.menu3dPortalBot,
    keyboard_controller: getLink(links.manager.links.keyboard_controller),
    debug: tags.debug,
    draggable: false,
    pointable: false,
}

const menu3dRootBot = create({
    ...MENU3DBOT_BASE_TAGS,
    menu3dBotType: 'root',
    form: 'nothing',
    anchorPoint: 'center',
    onRetrievedFromPool: ListenerString(() => {
        tags.inPool = false;
    }),
    configure: ListenerString(() => {
        const { menuBot, dimension } = that;

        if (tags.debug) {
            console.log(`[menu3dRootBot.${tagName}] that:`, that);
        }

        tags.menuBot = getLink(menuBot);
        tags.dimension = dimension;
        tags[dimension] = true;
        tags[dimension + 'X'] = 0;
        tags[dimension + 'Y'] = 0;
        tags[dimension + 'Z'] = 0;

        thisBot.vars.onMenuBotChanged = (listenerThat) => {
            if (tags.debug) {
                console.log(`[menu3dRootBot.onMenuBotChanged] changed tags:`, listenerThat.tags);
            }

            thisBot.resyncMenuBot();
        }

        thisBot.vars.onMenuBotDestroyed = () => {
            if (tags.debug) {
                console.log(`[${tags.system}.onMenuBotDestroyed] menu bot was just destroyed, destroy menu 3d bot.`);
            }

            // [SLOP] Do a full refresh of the menu 3d portal.
            if (tags.debug) {
                console.log(`[${tags.system}.${tagName}] going to refresh menu 3d portal because a menu bot was destroyed.`);
            }

            if (links.menu3dPortalBot) {
                links.menu3dPortalBot.refreshPortal();
            }
        }

        os.addBotListener(links.menuBot, 'onBotChanged', thisBot.vars.onMenuBotChanged);
        os.addBotListener(links.menuBot, 'onDestroy', thisBot.vars.onMenuBotDestroyed);

        // Adjust some settings for dropdown option buttons.
        if (menuBot.tags.abDropdownOption) {
            tags[dimension + 'X'] = 0.5;
        } else {
            tags[dimension + 'X'] = 0;
        }

        const otherMenu3dBots = links.menu3dBots.filter(b => b !== thisBot);

        // Set up some parameters to be the same across all other related bots.
        for (const bot of otherMenu3dBots) {
            bot.tags.menuBot = getLink(menuBot);
            bot.tags.dimension = dimension;
            bot.tags[dimension] = true;
            bot.tags[dimension + 'X'] = 0;
            bot.tags[dimension + 'Y'] = 0;
            bot.tags[dimension + 'Z'] = 0;
        }

        whisper(otherMenu3dBots, 'onConfigure', that);

        thisBot.resyncMenuBot();
    }),
    onReleasedToPool: ListenerString(() => {
        if (tags.debug) {
            console.log(`[menu3dRootBot.${tagName}] invoke`);
        }

        tags.inPool = true;

        const dimension = tags.dimension;

        if (dimension) {
            tags.dimension = null;
            tags[dimension] = null;
            tags[dimension + 'X'] = null;
            tags[dimension + 'Y'] = null;
            tags[dimension + 'Z'] = null;
        }

        if (links.menuBot) {
            os.removeBotListener(links.menuBot, 'onBotChanged', thisBot.vars.onMenuBotChanged);
            os.removeBotListener(links.menuBot, 'onDestroy', thisBot.vars.onMenuBotDestroyed);
        }
        
        tags.menuBot = null;

        if (links.menu3dBots) {
            const otherMenu3dBots = links.menu3dBots.filter(b => b !== thisBot);

            // Reset some parameters across all other related bots.
            for (const bot of otherMenu3dBots) {
                bot.tags.menuBot = null;

                if (dimension) {
                    bot.tags.dimension = null;
                    bot.tags[dimension] = null;
                    bot.tags[dimension + 'X'] = null;
                    bot.tags[dimension + 'Y'] = null;
                    bot.tags[dimension + 'Z'] = null;
                }
            }

            whisper(otherMenu3dBots, 'onReleasedToPool');
        }
    }),
    resyncMenuBot: ListenerString(() => {
        const menuBot = links.menuBot;

        if (!menuBot) {
            if (tags.debug) {
                console.log(`[menu3dRootBot.${tagName}] menu bot is no longer around, releasing back to pool.`);
            }

            links.menu3dBotPool.release(thisBot);
            return;
        }
        
        if (tags.debug) {
            console.log(`[menu3dRootBot.onMenuBotChanged] resync menu bot.`);
        }

        whisper(links.menu3dBots, 'onResyncMenuBot');
    }),
    onDestroy: ListenerString(() => {
        if (tags.debug) {
            console.log(`[menu3dRootBot.${tagName}] invoke`);
        }
    })
})

// Every menu 3d bot after this point gets a link to the root bot.
MENU3DBOT_BASE_TAGS.menu3dRootBot = getLink(menu3dRootBot);

// Every menu 3d bot after this point is parented to the root bot.
MENU3DBOT_BASE_TAGS.transformer = menu3dRootBot.id;

const menu3dShapeBot = create({
    ...MENU3DBOT_BASE_TAGS,
    menu3dBotType: 'shape',
    form: 'cube',
    pointable: true,
    scaleX: tags.menu3dBot_width,
    scaleY: tags.menu3dBot_height,
    scaleZ: tags.menu3dBot_depth,
    onClick: ListenerString(() => {
        if (links.menuBot.tags.form === 'input') {
            // Focus this bot for keyboard input.
            links.keyboard_controller.focus({ targetBot: thisBot })
        } else {
            whisper(links.menuBot, 'onClick', that);
        }
    }),
    onPointerEnter: ListenerString(() => {
        tags.hover = true;
    }),
    onPointerExit: ListenerString(() => {
        tags.hover = false;
    }),
    onPointerDown: ListenerString(() => {
        tags.down = true;
    }),
    onPointerUp: ListenerString(() => {
        tags.down = false;
    }),
    onKeyboardFocus: ListenerString(() => {
        masks.strokeColor = 'white';
        masks.strokeWidth = 5;
    }),
    onKeyboardBlur: ListenerString(() => {
        masks.strokeColor = null;
        masks.strokeWidth = null;
    }),
    onReleasedToPool: ListenerString(() => {
        masks.strokeColor = null;
        masks.strokeWidth = null;
    }),
    onKeyboardClick: ListenerString(() => {
        const { key } = that;

        if (key === 'Enter') {
            // [SLOP] Treat enter as submit for 3d menu inputs.
            if (links.menuBot.tags.menuItemText) {
                whisper(links.menuBot, 'onSubmit', { text: links.menuBot.tags.menuItemText });
            }
        } else {
            if (tags.debug) {
                console.log(`[menu3dShapeBot.${tagName}] that:`, that);
            }

            links.menuBot.tags.menuItemText = ab.links.utils.applyKeyToText({ key, text: links.menuBot.tags.menuItemText });

            whisper(links.menuBot, 'onInputTyping', { text: links.menuBot.tags.menuItemText });
        }

    }),
    refreshPointerState: ListenerString(async () => {
        if (tags.hover) {
            if (tags.down) {
                masks.color = await ab.links.utils.adjustBrightness({ color: tags.baseColor, factor: 0.9 });
            } else {
                masks.color = await ab.links.utils.adjustBrightness({ color: tags.baseColor, factor: 1.1 });
            }
        } else {
            masks.color = null;
        }
    }),
    onBotChanged: ListenerString(() => {
        let baseColorChanged = false;
        let hoverChanged = false;
        let downChanged = false;

        for (let tag of that.tags) {
            if (tag === 'hover') {
                hoverChanged = true;
            } else if (tag === 'down') {
                downChanged = true;
            } else if (tag === 'baseColor') {
                baseColorChanged = true;
            }
        }

        if (hoverChanged || downChanged || baseColorChanged) {
            thisBot.refreshPointerState();
        }
    }),
    onResyncMenuBot: ListenerString(() => {
        let cursor;
        if (links.menuBot.tags.form === 'input') {
            cursor = 'text';
        } else {
            if (links.menuBot.tags.onClick) {
                cursor = 'pointer';
            }
        }

        if (tags.cursor !== cursor) {
            tags.cursor = cursor;
        }

        if (tags.color !== links.menuBot.tags.color) {
            tags.baseColor = links.menuBot.tags.color;
            tags.color = links.menuBot.tags.color;
        }

        if (tags.soundClick !== links.menuBot.tags.soundClick) {
            tags.soundClick = links.menuBot.tags.soundClick;
        }
    })
});

menu3dBots.push(menu3dShapeBot);
menu3dRootBot.tags.menu3dShapeBot = getLink(menu3dShapeBot);

const menu3dLabelBot = create({
    ...MENU3DBOT_BASE_TAGS,
    menu3dBotType: 'label',
    color: 'clear',
    // color: 'red',
    pointable: false,
    label: '',
    scaleZ: 0,
    labelFontSize: 1,
    labelAlignment: 'left',
    labelWordWrapMode: 'breakWords',
    onResyncMenuBot: ListenerString(() => {
        const inXR = configBot.tags.arEnabled || configBot.tags.vrEnabled;

        // Label size
        let labelWidth;
        let labelX;
        let labelZ = inXR ? 0 : links.menu3dBotPool.tags.menu3dBot_depth;

        if (links.menuBot.tags.menuItemText) {
            // Submit button should be enabled.
            labelWidth = links.menu3dBotPool.tags.menu3dBot_width - (links.menu3dBotPool.tags.menu3dBot_iconWidth * 2);
            labelX = 0;
        } else {
            // No submit button.
            labelWidth = links.menu3dBotPool.tags.menu3dBot_width - links.menu3dBotPool.tags.menu3dBot_iconWidth;
            labelX = links.menu3dBotPool.tags.menu3dBot_iconWidth / 2;
        }

        if (tags.scaleX !== labelWidth) {
            tags.scaleX = labelWidth;
        }
        
        if (tags[tags.dimension + 'X'] !== labelX) {
            tags[tags.dimension + 'X'] = labelX;
        }

        if (tags[tags.dimension + 'Z'] !== labelZ) {
            tags[tags.dimension + 'Z'] = labelZ;
        }

        // Label text
        let labelText;

        if (links.menuBot.tags.form === 'input') {
            if (links.menuBot.tags.menuItemText) {
                labelText = links.menuBot.tags.menuItemText;
            } else {
                labelText = links.menuBot.tags.label;
            }
        } else {
            labelText = links.menuBot.tags.label;
        }

        if (tags.label !== labelText) {
            tags.label = labelText;
        }
    })
})

menu3dBots.push(menu3dLabelBot);
menu3dRootBot.tags.menu3dLabelBot = getLink(menu3dLabelBot);

const ICON_X = -(tags.menu3dBot_width / 2) + (tags.menu3dBot_iconWidth / 2);

const menu3dIconBot = create({
    ...MENU3DBOT_BASE_TAGS,
    menu3dBotType: 'icon',
    form: 'nothing',
    pointable: false,
    scaleX: tags.menu3dBot_iconSize,
    scaleY: tags.menu3dBot_iconSize,
    scaleZ: 0.1,
    iconX: ICON_X,
    iconZ: tags.menu3dBot_depth,
    onResyncMenuBot: ListenerString(async () => {
        await os.sleep(0);
        if (tags.icon !== links.menuBot.tags.formAddress) {
            tags.icon = links.menuBot.tags.formAddress;

            if (tags.icon) {
                tags.form = 'sprite';

                if (tags.icon.startsWith('https://')) {
                    tags.formAddress = tags.icon;
                } else  {
                    const iconUrl = links.manager.getMaterialIconURL({ iconName: tags.icon });
                    tags.formAddress = iconUrl;
                }
            } else {
                tags.form = 'nothing';
            }
        }

        if (tags[tags.dimension + 'X'] !== tags.iconX){
            tags[tags.dimension + 'X'] = tags.iconX;
        }

        if (tags[tags.dimension + 'Z'] !== tags.iconZ){
            tags[tags.dimension + 'Z'] = tags.iconZ;
        }
    }),
})

menu3dBots.push(menu3dIconBot);
menu3dRootBot.tags.menu3dIconBot = getLink(menu3dIconBot);

const SUBMIT_X = (tags.menu3dBot_width / 2) - (tags.menu3dBot_iconWidth / 2);

const menu3dSubmitBot = create({
    ...MENU3DBOT_BASE_TAGS,
    menu3dBotType: 'submit',
    pointable: true,
    formAddress: links.manager.getMaterialIconURL({ iconName: 'send' }),
    scaleX: tags.menu3dBot_iconSize,
    scaleY: tags.menu3dBot_iconSize,
    scaleZ: 0.1,
    cursor: 'pointer',
    submitX: SUBMIT_X,
    submitZ: tags.menu3dBot_depth,
    onClick: ListenerString(() => {
        if (links.menuBot.tags.menuItemText) {
            whisper(links.menuBot, 'onSubmit', { text: links.menuBot.tags.menuItemText });
        }
    }),
    onResyncMenuBot: ListenerString(() => {
        // Show/Hide submit button based on if there is text inputted.
        let form = links.menuBot.tags.menuItemText ? 'sprite' : 'nothing';
        if (tags.form !== form) {
            tags.form = form;
        }

        if (tags[tags.dimension + 'X'] !== tags.submitX) {
            tags[tags.dimension + 'X'] = tags.submitX
        }
        
        if (tags[tags.dimension + 'Z'] !== tags.submitZ) {
            tags[tags.dimension + 'Z'] = tags.submitZ
        }
    }),
})

menu3dBots.push(menu3dSubmitBot);
menu3dRootBot.tags.menu3dSubmitBot = getLink(menu3dSubmitBot);

menu3dRootBot.masks.menu3dBots = getLink(menu3dBots);

return menu3dRootBot;