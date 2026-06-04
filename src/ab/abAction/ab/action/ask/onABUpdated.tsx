if (configBot.tags.abInstDirectiveBeforeUpdate) {
    setTagMask(thisBot, 'abInstDirective', configBot.tags.abInstDirectiveBeforeUpdate, 'shared');
    configBot.tags.abInstDirectiveBeforeUpdate = null;
}