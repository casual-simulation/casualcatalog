tags.targetBot = ab.links.remember.tags.abBotFocus;
tags.onSubmit = `@
    links.baseSkill.abCoreMenuAction({message: that.text, menu: "bot", bot: links.targetBot});
    setTagMask(links.baseSkill, 'hasUserSubmittedBotText', true, 'local');
`;
tags.onInputTyping = `@
    if (!tags.stopSuggestion) {
        tags.stopSuggestion = true;
    }
    
    if (!tags.hasUserTypedBotText) {
        setTagMask(links.baseSkill, 'hasUserTypedBotText', true, 'local');
    }
`;
tags.form = "input";

if (!authBot)
{
    tags.label = "ask " + ab.links.personality.tags.abBuilderIdentity + " (limited)";
}
else if (authBot.tags.subscriptionTier == "FreePlay")
{
    tags.label = "ask " + ab.links.personality.tags.abBuilderIdentity + " (limited)";
}
else
{
    tags.label = "ask " + ab.links.personality.tags.abBuilderIdentity;
}


if (!links.baseSkill.tags.hasUserTypedBotText && !links.baseSkill.tags.hasUserSubmittedBotText) {
    await os.sleep(links.baseSkill.tags.inputSuggestionWaitMS);

    if (!links.baseSkill.tags.hasUserTypedBotText) {
        // Choose a random from built-in suggestions.
        const suggestions = links.baseSkill.tags.suggestions["bot"];
        const text = suggestions[math.randomInt(0, suggestions.length - 1)];

        links.baseSkill.inputSuggestion({ inputBot: thisBot, text });
    }
}