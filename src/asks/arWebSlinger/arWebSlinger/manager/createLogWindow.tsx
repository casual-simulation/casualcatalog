const {
    dimension,
    position = new Vector3(0, 0, 0),
    width = 5,
    height = 2,
} = that;

const logWindowBots = [];

const BASE_TAGS = {
    space: 'tempLocal',
    draggable: false,
    pointable: false,
    dimension,
    debug: tags.debug,
    [dimension]: true,
    [dimension + 'X']: 0,
    [dimension + 'Y']: 0,
    [dimension + 'Z']: 0,
    onABWebSlingerTeardown: ListenerString(() => {
        destroy(thisBot);
    })
}

const rootBot = create({
    ...BASE_TAGS,
    form: 'nothing',
    logWindowBotType: 'root',
    anchorPoint: 'center',
    fonts: getLink(links.fonts),
    [dimension + 'X']: position.x,
    [dimension + 'Y']: position.y,
    [dimension + 'Z']: position.z,
    logsToShow: 3,
    initialize: ListenerString(() => {
        if (tags.initialized) {
            return;
        }

        tags.initialized = true;

        if (tags.debug) {
            console.log(`[logWindow-${tags.logWindowBotType}.${tagName}] invoke`);
        }

        thisBot.update();
    }),
    onABConsoleLogMessageBotAdded: ListenerString(() => {
        thisBot.update();
    }),
    onABConsoleLogMessageBotRemoved: ListenerString(() => {
        thisBot.update();
    }),
    update: ListenerString(() => {
        const logBots = getBots(b => b.tags.consoleLogMessageBot);

        logBots.sort((a, b) => {
            return new Date(a.tags.timestamp) > new Date(b.tags.timestamp) ? 1 : -1
        })

        const logBotsToShow = logBots.slice(-tags.logsToShow);

        let label;

        if (logBotsToShow.length > 0) {
            label = '';

            for (let i = 0; i < logBotsToShow.length; i++) {
                if (i > 0) {
                    label += '\n\n'
                }

                const logBot = logBotsToShow[i];

                if (logBot.tags.name) {
                    label += `${logBot.tags.name}: `;
                }

                label += `${logBot.tags.message}`

            }

            links.logLabelBot.tags.label = label;
        } else {
            label = 'no message yet';
        }

        if (tags.debug) {
            console.log(`[logWindow-${tags.logWindowBotType}.${tagName}] label (before truncate):`, label);
        }

        const truncateParams = {
            label,
            fontSize: links.logLabelBot.tags.labelFontSize,
            fontName: 'roboto',
            wordWrap: true,
            maxWidth: links.logLabelBot.tags.scaleX,
            maxHeight: links.logLabelBot.tags.scaleY,
            gutterSpaces: 0
        }

        label = links.fonts.truncateLabel(truncateParams);

        if (tags.debug) {
            console.log(`[logWindow-${tags.logWindowBotType}.${tagName}] label (after truncate):`, label);
        }

        if (links.labelSizeBox) {
            const labelSize = fonts.calculateLabelSize({...truncateParams, label });
            links.labelSizeBox.tags.scaleX = labelSize.width;
            links.labelSizeBox.tags.scaleY = labelSize.height;
            links.labelSizeBox.tags[tags.dimension + 'X'] = -tags.scaleX / 2;
            links.labelSizeBox.tags[tags.dimension + 'Y'] = tags[tags.dimension + 'Y'];
        }

        links.logLabelBot.tags.label = label;
    })
})
logWindowBots.push(rootBot);

const WINDOW_WIDTH = width;
const WINDOW_HEIGHT = height;
const WINDOW_DEPTH = 0.1;

const windowBot = create({
    ...BASE_TAGS,
    form: 'cube',
    logWindowBotType: 'window',
    // color: ab.links.personality.tags.abBaseMenuColor,
    color: 'black',
    formOpacity: 0.6,
    transformer: rootBot.id,
    [dimension + 'X']: 0,
    [dimension + 'Y']: 0,
    [dimension + 'Z']: 0,
    scaleX: WINDOW_WIDTH,
    scaleY: WINDOW_HEIGHT,
    scaleZ: WINDOW_DEPTH
})
logWindowBots.push(windowBot);
rootBot.tags.windowBot = getLink(windowBot);

const LABEL_LEFT_MARGIN = 0.1;
const LABEL_RIGHT_MARGIN = 0.1;
const LABEL_TOP_MARGIN = 0.1;
const LABEL_BOTTOM_MARGIN = 0.1;
const LABEL_WIDTH = WINDOW_WIDTH - LABEL_LEFT_MARGIN - LABEL_RIGHT_MARGIN;
const LABEL_HEIGHT = WINDOW_HEIGHT - LABEL_TOP_MARGIN - LABEL_BOTTOM_MARGIN;

const logLabelBot = create({
    ...BASE_TAGS,
    logWindowBotType: 'log_label',
    transformer: rootBot.id,
    color: 'clear',
    // color: 'red',
    label: '',
    labelColor: 'white',
    scaleX: LABEL_WIDTH,
    scaleY: LABEL_HEIGHT,
    scaleZ: 0,
    labelFontSize: 0.5,
    labelAlignment: 'left',
    labelWordWrapMode: 'breakWords',
    [dimension + 'Z']: WINDOW_DEPTH,
})
logWindowBots.push(logLabelBot);
rootBot.tags.logLabelBot = getLink(logLabelBot);

// Give root bot links to all the bots of this log window.
rootBot.links.logWindowBots = getLink(logWindowBots);

rootBot.initialize();

return rootBot;