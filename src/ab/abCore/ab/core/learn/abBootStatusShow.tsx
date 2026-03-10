const {
    label = `booting up`,
} = that ?? {}

if (configBot.tags.menuPortal !== 'abBootStatus') {
    configBot.tags.menuPortal = 'abBootStatus';
}

const activeBootStatusBot = thisBot.vars.bootStatusBotId ? getBot('id', thisBot.vars.bootStatusBotId) : null;

if (activeBootStatusBot) {
    activeBootStatusBot.tags.busyLabel = label;
    return;
}


// NOTE: The styling of this menuBot is taken from ab.interface.menu.abCreateMenuButton, and much 
// of the logic is taken fromab.interface.menu.abCreateMenuBusyIndicator.
const shadowColor = links.remember.tags.abBaseShadowColor ?? "#000";

const bootStatusMod = {
    space: 'tempLocal',
    abBootStatus: true,
    busyLabel: label,
    color: links.remember.tags.abBaseMenuColor,
    labelColor: links.remember.tags.abBaseMenuLabelColor ?? '#000',
    labelAlignment: 'left',
    shadowColor: links.remember.tags.abBaseShadowColor ?? "#000",
    trackNum: 0,
    scaleY: 1,
    state: 0,
    animRate: 500,
    animStates: [
        {
            ellipsis: '',
            formAddress: 'hourglass_top',
        },
        {
            ellipsis: '.',
            formAddress: 'hourglass_bottom',
        },
        {
            ellipsis: '..',
            formAddress: 'hourglass_top',
        },
        {
            ellipsis: '...',
            formAddress: 'hourglass_bottom',
        },
    ],
    menuItemStyle: {
        'border-radius': '8px',
        'margin-top': '8px',
        'box-shadow': `3px 4px ${shadowColor}`,
        'min-height': '44px',
        'border': `2px solid ${shadowColor}`,
        'width': 'calc(100% - 5px)'
    },
    onBotAdded: `@
        thisBot.refreshDisplay();
        thisBot.animate();
    `,
    onBotChanged: `@
        const needRefresh = that.tags.some(t => t === 'busyLabel' || t === 'state' || t === 'animStates');
        if (needRefresh) {
            thisBot.refreshDisplay();
        }
    `,
    refreshDisplay: `@
        if (tags.animStates && tags.animStates.length > 0) {
            const animState = tags.animStates[tags.state];

            tags.label = tags.busyLabel.trim() + animState.ellipsis;
            tags.formAddress = animState.formAddress;
        } else {
            tags.label 
        }
    `,
    animate: `@
        if (tags.state >= tags.animStates.length - 1) {
            tags.state = 0;
        } else {
            tags.state += 1;
        }

        await os.sleep(tags.animRate);
        thisBot.animate();
    `,
    onDestroy: `@
        if (configBot.tags.menuPortal === 'abBootStatus') {
            configBot.tags.menuPortal = null;
        }
    `,
};

const bootStatusBot = create(bootStatusMod);
thisBot.vars.bootStatusBotId = bootStatusBot.id;