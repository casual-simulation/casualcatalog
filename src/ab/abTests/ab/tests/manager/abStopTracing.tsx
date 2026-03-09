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

const traceName = 'traces.' + pad(bot.vars.traceCounter.toString());
const rendered = thisBot.renderTimeline({ timeline: finalTimeline, name: traceName });
const { resultBot } = thisBot.createBotsForRenderedTimeline({ result: rendered, system: traceName });

shout("abSleep", "wake");
thisBot.renderTestingApp();

os.focusOn(resultBot, {
    tag: 'timeline',
    portal: 'system',
    lineNumber: 0,
    columnNumber: 0
}).catch(e => {})

function pad(str) {

    let remaining = 6 - str.length;
    if (remaining > 0) {
        let padded = '0'.repeat(remaining);
        return padded + str;
    }

    // while(str.length < 6) {
    //     str += '0' + str;
    // }

    return str;
}