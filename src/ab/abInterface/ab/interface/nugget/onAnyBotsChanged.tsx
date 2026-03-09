if (configBot && that[0].bot.id != thisBot.id) 
{
    if (!configBot.tags.editingBot) return; // Ignore if the configBot isn't ready yet.

    const editedBotID = configBot.tags.editingBot.replace("🔗", "");

    if (!that.find(x => x.bot.id == editedBotID)) return; // If the bot changed wasn't being edited by the user ignore it.

    const editedTag = configBot.tags.editingTag;
    const editedBot = getBot("id", editedBotID);

    if (editedBot && editedTag) 
    {
        shout("nuggetReset");

        thisBot.nuggetParse({ editedBot, editedTag });
    }
}