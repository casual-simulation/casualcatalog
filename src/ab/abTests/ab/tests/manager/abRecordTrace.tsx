const d = await os.createDebugger({
    pausable: true,
    allowAsynchronousScripts: true
});

if (!bot.vars.traceCounter) {
    bot.vars.traceCounter = 0;
}
bot.vars.traceCounter += 1;
bot.vars.debug = d;
bot.vars.tracing = true;
bot.vars.timeline = [];
await bot.hookupDebugger({ debug: d, addKeys: false, timeline: bot.vars.timeline, noWarnMissingKeys: true });
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