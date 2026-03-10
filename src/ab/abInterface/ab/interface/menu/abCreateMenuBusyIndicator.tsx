const {
    label = `${abPersonality.tags.abBuilderIdentity} is working`,
    ...rest
} = that ?? {}

let busyIndicator = {
    onPointerUp: null,
    onPointerDown: null,
    pointable: false,
    busyLabel: label,
    labelAlignment: 'left',
    state: 0,
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
    animRate: 500,
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
    ...rest
};

const menuBot = thisBot.abCreateMenuButton(busyIndicator);

return menuBot;