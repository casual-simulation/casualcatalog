const { input } = that;

if (input.sourceId === (tags.gptSourceId ?? thisBot.id)) {
    thisBot.changeAnimState('ThinkingSuccess');
}