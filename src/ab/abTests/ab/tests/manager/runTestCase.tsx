const testCase = getBot('id', that);
if (!testCase) {
    console.log('Test case not found!');
    return;
}

if (testCase.tags.system) {
    destroy(getBots(
        byTag('__testResult', true)
    ));
}

const d = await os.createDebugger({
    pausable: true,
    allowAsynchronousScripts: true
});

if (typeof testCase.tags.randomSeed === 'number' || typeof testCase.tags.randomSeed === 'string') {
    d.math.setRandomSeed(testCase.tags.randomSeed);
}
const timeline = [];
await bot.hookupDebugger({ debug: d, timeline });
await bot.addBotsToDebugger(d);

let actionsToPerform = [];
let asyncResults = {}; 

for (let event of testCase.tags.timeline) {
    preprocessEvent(event);
}

function preprocessEvent(event) {
    if (event.type === 'user_action') {
        if ('timeline' in event) {
            for (let e of event.timeline) {
                preprocessEvent(e);
            }
        } else {
            let action = event.action;
            if (action.type === 'action' && 'keys' in action) {
                let botIds = action.keys.map(k => {
                    return d.getID(d.getBot(
                        either(
                            byTag('system', k),
                            byTag('__key', k))
                    ));
                });

                action = {
                    ...action,
                    botIds,
                };
                delete action.keys;
                actionsToPerform.push(action);
            } else if (action.type === 'async_result') {
                asyncResults[action.taskId] = action;
            }
        }
    } else if (event.type === 'script') {
        for (let e of event.timeline) {
            preprocessEvent(e);
        }
    }
}

let resolve;
let reject;
let promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
})

const expectedTimeline = testCase.tags.timeline.slice();

d.onScriptActionEnqueued(a => {
    if (a.type !== 'async_result' && 'taskId' in a) {
        // async task was enqueued
        // send async result
        let result = asyncResults[a.taskId];
        if (result) {
            d.performUserAction(result);
        }
    }
});

for (let a of actionsToPerform) {
    console.log('perform', a);
    await d.performUserAction(a);
}

for (let i = 0; i < 50; i++) {
    await Promise.resolve();
}

const resultTimeline = bot.compileTimeline({ timeline: timeline });

console.log('Result', resultTimeline);

let renderedResult = thisBot.renderTimeline({ timeline: resultTimeline, name: testCase.tags.testName });
let expectedResult = thisBot.renderTimeline({ timeline: expectedTimeline, name: testCase.tags.testName });

if (renderedResult.string === expectedResult.string) {
    return {
        success: true
    };
    // os.toast('Sucess!');
} else {
    const system = 'test-failures.' + testCase.tags.testName;
    let { resultBot } = thisBot.createBotsForRenderedTimeline({
        system,
        result: renderedResult,
        creator: testCase,
        systemTag: 'testSystem'
    });

    let { resultBot: expectedBot } = thisBot.createBotsForRenderedTimeline({
        system,
        result: expectedResult,
        testCase,
        systemTag: 'system'
    });

    return {
        success: false,
        system: system,
        diffBotId: expectedBot.id,
    };
}