tags.dimension = links.remember.tags.abGridFocus.dimension;
tags.dimensionX = links.remember.tags.abGridFocus.position.x;
tags.dimensionY = links.remember.tags.abGridFocus.position.y;
tags.onSubmit = `@
    links.baseSkill.abCoreMenuAction({message: that.text, menu: "grid", dimension: tags.dimension, dimensionX: tags.dimensionX, dimensionY: tags.dimensionY});
    setTagMask(links.baseSkill, 'hasUserSubmittedCoreText', true, 'local');
`;
tags.onInputTyping = `@
    if (!tags.stopSuggestion) {
        tags.stopSuggestion = true;
    }
    
    if (!tags.hasUserTypedCoreText) {
        setTagMask(links.baseSkill, 'hasUserTypedCoreText', true, 'local');
    }
`;
tags.form = "input";

if (!authBot)
{
    tags.label = "ask " + links.personality.tags.abBuilderIdentity + " (limited)";
}
else if (authBot.tags.subscriptionTier == "FreePlay")
{
    tags.label = "ask " + links.personality.tags.abBuilderIdentity + " (limited)";
}
else
{
    tags.label = "ask " + links.personality.tags.abBuilderIdentity;
}

if (!links.baseSkill.tags.hasUserTypedCoreText && !links.baseSkill.tags.hasUserSubmittedCoreText) {
    await os.sleep(links.baseSkill.tags.inputSuggestionWaitMS);

    if (!links.baseSkill.tags.hasUserTypedCoreText) {
        // Choose a random from built-in suggestions.
        let text = links.baseSkill.tags.suggestionsGrid[math.randomInt(0, links.baseSkill.tags.suggestionsGrid.length - 1)];

        links.baseSkill.inputSuggestion({ inputBot: thisBot, text });
    }
}