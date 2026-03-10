if (bot.vars.debug) {
    await os.detachDebugger(bot.vars.debug);
}

bot.vars.debug = null;
bot.vars.tracing = null;

if (bot.vars.originalGridPortal) {
    configBot.tags.gridPortal = bot.vars.originalGridPortal;
    bot.vars.originalGridPortal = null;
}

console.log('[debug] Done!');
let finalTimeline = bot.compileTimeline({ timeline: bot.vars.timeline });

create({
    __test: true,
    __testCase: true,
    timeline: '🧬' + getFormattedJSON(finalTimeline.slice()),
    onClick: `@shout('runTestCase', thisBot.id)`,
    system: 'tests.' + bot.vars.testName,
    randomSeed: bot.vars.randomSeed,
    testName: bot.vars.testName
});

shout("abSleep", "wake");
thisBot.renderTestingApp();