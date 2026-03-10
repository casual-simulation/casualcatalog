const { system, result, creator, systemTag } = that;

// const system = systemPrefix + testCase.tags.testName;

let resultBot = create({
    space: 'tempLocal',
    creator: creator?.id,
    __test: true,
    __testResult: true,
    timeline: result.string,
    [systemTag ?? 'system']: system
});

const markerMod = {
    space: 'tempLocal',
    creator: resultBot.id,
    __test: true,
    __testResult: true,
    form: 'codeButton',
    onClick: `@os.focusOn(bot.tags.location.botId, { portal: 'system', tag: bot.tags.location.tag, lineNumber: bot.tags.location.line, columnNumber: bot.tags.location.column }).catch(e => {})`
};

for (let marker of result.markers) {
    create(markerMod, {
        [`${resultBot.id}.timeline`]: true,
        [`${resultBot.id}.timelineStart`]: marker.line,
        label: marker.label,
        location: marker.location,
    });
}

return {
    resultBot
};