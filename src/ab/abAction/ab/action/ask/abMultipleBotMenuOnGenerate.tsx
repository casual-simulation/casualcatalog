const allTargetBots = ab.links.remember.links.abMultipleBotFocus;
const targetArray = [];

for (let i = 0; i < allTargetBots.length; i++)
{
    targetArray.push(allTargetBots[i].id);
}

tags.targetBots = targetArray;
tags.onSubmit = `@
    links.baseSkill.abCoreMenuAction({message: that.text, menu: "multipleBot", bots: tags.targetBots});
    setTagMask(links.baseSkill, 'hasUserSubmittedMultipleBotText', true, 'local');
`;
tags.onInputTyping = `@
    if (!tags.stopSuggestion) {
        tags.stopSuggestion = true;
    }
    
    if (!tags.hasUserTypedMultipleBotText) {
        setTagMask(links.baseSkill, 'hasUserTypedMultipleBotText', true, 'local');
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

if (!links.baseSkill.tags.hasUserTypedMultipleBotText && !links.baseSkill.tags.hasUserSubmittedMultipleBotText) {
    await os.sleep(links.baseSkill.tags.inputSuggestionWaitMS);

    if (!links.baseSkill.tags.hasUserTypedMultipleBotText) {
        // Choose a random from built-in suggestions.
        const suggestions = links.baseSkill.tags.suggestions["multipleBot"];
        const text = suggestions[math.randomInt(0, suggestions.length - 1)];

        links.baseSkill.inputSuggestion({ inputBot: thisBot, text });
    }
}