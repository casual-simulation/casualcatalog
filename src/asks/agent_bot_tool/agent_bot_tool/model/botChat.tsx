const dimension = configBot.tags.gridPortal;
const message = that.message;
const messageTime = that.time ? that.time * 1000 : 1600; 

ab.links.manifestation.abBotChat({
    bot: thisBot,
    dimension,
    message,
    messageTime,
});