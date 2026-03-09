if (configBot.tags.abWasAwakeBeforeUpdate) {
    configBot.tags.abWasAwakeBeforeUpdate = null;
    await thisBot.abSetAwake({ awake: true })
}