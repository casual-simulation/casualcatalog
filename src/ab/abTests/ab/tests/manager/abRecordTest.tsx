const testName = await os.showInput('', {
    title: 'Enter test name'
});

if (!testName) {
    os.toast("You must provide a test name in order to record a test.");
    return;
}

const d = await os.createDebugger({
    pausable: true,
    allowAsynchronousScripts: true
});

const seed = math.randomInt(-2147483648, 2147483647);
bot.vars.tracing = null;
bot.vars.testName = testName;
bot.vars.randomSeed = seed;
bot.vars.debug = d;
d.math.setRandomSeed(seed);
bot.vars.timeline = [];
await bot.hookupDebugger({ debug: d, addKeys: true, timeline: bot.vars.timeline });
await bot.addBotsToDebugger(d);

await os.attachDebugger(d, {
    tagNameMapper: {
        forward: forwardMapTagName,
        reverse: reverseMapTagName
    },
});

await os.sleep(1000);

if (configBot.tags.gridPortal) {
    bot.vars.originalGridPortal = configBot.tags.gridPortal;
    d.configBot.tags.gridPortal = configBot.tags.gridPortal = 'test-' + configBot.tags.gridPortal;
}

shout("abSleep", "sleep");
shout('abReset');

function forwardMapTagName(name) {
    const builtinTags = os.listBuiltinTags();
    if (builtinTags.some(t => t === name)) {
        return name;
    }

    return 'test-' + name;
}

function reverseMapTagName(name) {
    const builtinTags = os.listBuiltinTags();
    if (builtinTags.some(t => t === name)) {
        return name;
    }

    let withoutTest = name.substring('test-'.length);
    return withoutTest;
}

await os.registerApp('abTestingApp', thisBot);
thisBot.renderTestingApp();