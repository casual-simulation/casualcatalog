const { sourceId } = that;

if (sourceId === (tags.gptSourceId ?? thisBot.id)) {
    thisBot.changeAnimState('ThinkingBegin');
}