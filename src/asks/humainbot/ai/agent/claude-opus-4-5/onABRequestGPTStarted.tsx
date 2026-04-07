const { input } = that;

if (input.sourceId === (tags.gptSourceId ?? thisBot.id)) {
    if (tags.animState !== 'Thinking') {
        thisBot.changeAnimState('ThinkingBegin');
    }
}