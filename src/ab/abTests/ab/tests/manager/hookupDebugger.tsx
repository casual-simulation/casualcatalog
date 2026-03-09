const { debug: d, addKeys, timeline, noWarnMissingKeys } = that;
const botTimeline = timeline ?? [];

const actionTimelines = {};
const scriptTimelines = {};

let emittedActions = [];
const asyncRequests = new Map();
let asyncTimeline = null;
let syncCounter = 0;

let botKeys = {};

function shouldSkipAction(a) {
    const c = d.configBot;
    if (!c) {
        return true;
    }
    if (a.type !== 'action') {
        if (a.type === 'update_bot') {
            return true;
        } else if (a.type === 'add_bot') {
            return true;
        } else if (a.type === 'remove_bot') {
            return true;
        } else if (a.type === 'async_result') {
            return false;
        } else if (a.type === 'async_error') {
            return false;
        } else if (a.type === 'apply_state') {
            return true;
        } else if (a.type === 'register_builtin_portal') {
            return true;
        } else if(a.type === 'custom_app_container_available') {
            return true;
        } else if (a.type === 'register_html_app' && a.appId === '_root') {
            return true;
        } else if (a.type === 'define_global_bot') {
            return true;
        }

        return false;
    }

    return false;
}

function shouldSkipUpdateForBot(update) {
    const b = getBot(byID(update.botId));
    return (
        b && (
            byTag('ab')(b) || byTag('abID')(b)
        )
    );
}

d.onBeforeUserAction(a => {
    if (shouldSkipAction(a)) {
        return;
    }
    console.log('user action', a);

    if (a.type === 'action') {
        asyncTimeline = null;
        syncCounter += 1;
        addBotAction(a);
    } else {
        if (a.type === 'async_result') {
            // the timeline that started the async request.
            asyncTimeline = asyncRequests.get(a.taskId);
            if (!asyncTimeline) {
                console.log('async', asyncRequests, a);
                throw new Error(`Async timeline not found for task! (taskId: ${a.taskId})`);
            }
            asyncTimeline.push({
                type: 'user_action',
                action: a,
            });
        } else {
            botTimeline.push({
                type: 'user_action',
                action: a,
            });
        }
    }
});

d.onScriptActionEnqueued(a => {
    console.log('emit action', a);
    console.log('call stack', d.getCallStack());
    let timeline = getCurrentScriptTimeline();

    if (timeline) {
        timeline.push({
            type: 'emitted_action',
            action: a,
            location: getCurrentScriptLocation() 
        });
    }

    if ('taskId' in a) {
        if (!timeline) {
            debugger;
            throw new Error('The timeline for the script action could not be found!');
        }
        asyncRequests.set(a.taskId, timeline);
    }
});

d.onAfterScriptUpdatedTag(update => {
    if (shouldSkipUpdateForBot(update)) {
        return;
    }

    console.log('update tag', update);
    console.log('call stack', d.getCallStack());
    let timeline = getCurrentScriptTimeline();

    if (timeline) {
        let { botId, ...rest } = update;

        timeline.push({
            type: 'update_tag',
            update: {
                ...rest,
                botId: getBotKey(botId) ?? botId
            },
            location: getCurrentScriptLocation()
        });
    }
});

d.onAfterScriptUpdatedTagMask(update => {
    if (shouldSkipUpdateForBot(update)) {
        return;
    }

    console.log('update tag mask', update);
    console.log('call stack', d.getCallStack());
    let timeline = getCurrentScriptTimeline();

    if (timeline) {
        let { botId, ...rest } = update;

        timeline.push({
            type: 'update_tag_mask',
            update: {
                ...rest,
                botId: getBotKey(botId) ?? botId
            },
            location: getCurrentScriptLocation()
        });
    }
});

function getCurrentScriptTimeline() {
    if (!asyncTimeline) {
        let currentScript = getCurrentScript();
        if (currentScript) {
            return getScriptTimeline(currentScript.botId, currentScript.tag, syncCounter);
        }
        return null;
    } else {
        return asyncTimeline;
    }
}

function getScriptTimeline(botId, tag, syncCounter) {
    const key = `${botId}.${tag}:${syncCounter}`;
    let timeline = scriptTimelines[key];
    if (!timeline) {
        scriptTimelines[key] = timeline = [];
        let actionTimeline = actionTimelines[syncCounter];

        if (actionTimeline) {
            const originalBotId = getOriginalBotId(botId);
            actionTimeline.push({
                type: 'script',
                botId: getBotKey(botId),
                tag: tag,
                count: syncCounter,
                timeline,
                location: {
                    botId: originalBotId,
                    tag,
                    line: 0,
                    column: 0
                }
            });
        }
    }
    return timeline;
}

function getCurrentScript() {
    const callStack = d.getCallStack();
    for (let i = 0; i < callStack.length; i++) {
        let frame = callStack[i];
        if (frame.location?.botId && frame.location?.tag) {
            return {
                botId: frame.location.botId,
                tag: frame.location.tag
            }
        }
    };

    return null;
}

function getCurrentScriptLocation() {
    const callStack = d.getCallStack();
    for (let i = callStack.length - 1; i >= 0; i--) {
        let frame = callStack[i];
        if (frame.location?.botId && frame.location?.tag) {
            const botId = getOriginalBotId(frame.location.botId);
            return {
                botId: botId,
                tag: frame.location.tag,
                line: frame.location.lineNumber,
                column: frame.location.columnNumber
            };
        }
    };

    return null;
}

async function addBotAction(a) {
    let action;
    if (a.botIds) {
        let keys = [];
        for (let botId of a.botIds) {
            const key = getBotKey(botId);
            if (!key) {
                continue;
            }

            keys.push(key);
        }

        action = {
            ...a,
            keys
        };
        delete action.botIds;
    } else {
        action = a;
    }

    const timeline = actionTimelines[syncCounter] = [
        {
            type: 'user_action',
            action: action,
        }
    ];
    botTimeline.push({
        type: 'user_action',
        timeline: timeline
    });
}

function getOriginalBotId(botId) {
    let bot = d.getBot('id', botId);
    if (!bot || !bot.tags.__originalBotId) {
        return null;
    }
    let originalBot = getBot('id', bot.tags.__originalBotId);
    if (!originalBot) {
        return null;
    }

    return originalBot.id;
}

function getBotKey(botId) {
    let bot = d.getBot('id', botId);
    if (!bot || !bot.tags.__originalBotId) {
        return null;
    }
    let originalBot = getBot('id', bot.tags.__originalBotId);
    if (!originalBot) {
        return null;
    }
    let key = bot.tags.__key ?? bot.tags.system ?? botKeys[botId];
    if (!key) {
        if (addKeys) {
            key = botKeys[botId] = originalBot.tags.__key = uuid();
        } else if (noWarnMissingKeys) {
            key = originalBot.id;
        } else {
            console.warn(`No key could be determined for ${botId}! Set the system tag or the __key tag to enable consistent tests.`);
            os.toast(`No key could be determined for ${botId}! Set the system tag or the __key tag to enable consistent tests.`);
        }
    }
    return key;
}