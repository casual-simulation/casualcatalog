tags.onSubmit = `@
    links.baseSkill.abCoreMenuAction({message: that.text, menu: "core"});
    masks.menuItemText = "";
`;

tags.form = "input";

if (!authBot)
{
    tags.label = "you must be logged in to chat with " + abPersonality.tags.abBuilderIdentity;
}
else if (authBot.tags.subscriptionTier == "FreePlay")
{
    tags.label = "chat with " + abPersonality.tags.abBuilderIdentity + " (limited)";
}
else
{
    tags.label = "chat with " + abPersonality.tags.abBuilderIdentity;
}